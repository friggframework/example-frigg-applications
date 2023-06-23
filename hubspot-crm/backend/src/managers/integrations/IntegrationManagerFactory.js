const { IntegrationManager: Parent } = require('@friggframework/integrations');
const EntityManager = require('../entities/EntityManagerFactory');

const salesforceIntegrationManager = require('./SalesforceIntegrationManager');
const hubspotIntegrationManager = require('./HubSpotIntegrationManager');

class IntegrationManagerFactory extends Parent {
    static integrationManagerClasses = [
        salesforceIntegrationManager,
        hubspotIntegrationManager
    ];

    static integrationTypes = IntegrationManagerFactory.integrationManagerClasses.map(
        (ManagerClass) => ManagerClass.getName()
    );

    constructor(params) {
        super(params);
    }

    static async getInstanceFromIntegrationId(params) {
        const integration = await IntegrationManagerFactory.getIntegrationById(
            params.integrationId
        );
        let { userId } = params;
        if (!integration) {
            throw new Error(
                `No integration found by the ID of ${params.integrationId}`
            );
        }

        if (!userId) {
            userId = integration.user._id.toString();
        } else if (userId !== integration.user._id.toString()) {
            throw new Error(
                `Integration ${
                    params.integrationId
                } does not belong to User ${userId}, ${integration.user.id.toString()}`
            );
        }

        const integrationManagerIndex =
            IntegrationManagerFactory.integrationTypes.indexOf(
                integration.config.type
            );
        const integrationManagerClass =
            IntegrationManagerFactory.integrationManagerClasses[
                integrationManagerIndex
                ];

        const instance = await integrationManagerClass.getInstance({
            userId,
            integrationId: params.integrationId,
        });
        instance.integration = integration;
        instance.delegateTypes.push(...integrationManagerClass.Config.events); // populates the events available
        // Need to get special primaryInstance because it has an extra param to pass in
        instance.primaryInstance =
            await EntityManager.getEntityManagerInstanceFromEntityId(
                instance.integration.entities[0],
                instance.integration.user
            );
        // Now we can use the general ManagerGetter
        instance.targetInstance =
            await EntityManager.getEntityManagerInstanceFromEntityId(
                instance.integration.entities[1],
                instance.integration.user
            );
        instance.delegate = instance;
        return instance;
    }
}

module.exports = IntegrationManagerFactory;
