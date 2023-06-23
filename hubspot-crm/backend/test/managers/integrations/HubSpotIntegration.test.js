const HubSpotIntegrationManager = require('../../../src/managers/integrations/HubSpotIntegrationManager');
const HubSpotEntityManager = require('../../../src/managers/entities/HubSpotManager');
const PrimaryEntityManager = require('../../../src/managers/entities/ConnectWiseManager');
// const MockAPI = require('@friggframework/api-module-hubspot/mockApi');
const mockDealsResponse = require('../../fixtures/hubspot/deals.json');
const mongoose = require("mongoose");
const {Integration} = require("@friggframework/integrations");

function MockedIntegration() {
    return {
        create: () => {
            const integration = new Integration();
            integration.id = new mongoose.Types.ObjectId();
            integration.config = {};
            integration.user = { _id: new mongoose.Types.ObjectId() };
            return integration;
        },
    };
}

class MockedHubSpotIntegrationManager {
    static manager = null;

    static getInstanceFromIntegrationId({ integrationId }) {
        if (MockedHubSpotIntegrationManager.manager) {
            return MockedHubSpotIntegrationManager.manager;
        }

        const manager = new HubSpotIntegrationManager();

        manager.delegate = manager;
        manager.delegateTypes.push('EXAMPLE_EVENT');
        manager.integration = (new MockedIntegration()).create();

        manager.primaryInstance = new PrimaryEntityManager({ userId: manager.integration.user._id });
        manager.primaryInstance.entity = { _id: new mongoose.Types.ObjectId() };

        manager.primaryInstance.api = {
            // mocked API responses from Ironclad
        };
        // Spies on whatever methods we want to track
        // sinon.spy(manager.primaryInstance.api, 'createWebhook');


        manager.targetInstance = new HubSpotEntityManager({ userId: manager.integration.user._id });

        manager.targetInstance.api = {
            searchDeals: jest.fn().mockResolvedValue(mockDealsResponse),
        };


        MockedHubSpotIntegrationManager.manager = manager;
        return manager;
    }
}


describe('HubSpot Integration Manager', () => {
    let integrationManager;
    beforeAll(async () => {
        integrationManager = await MockedHubSpotIntegrationManager.getInstanceFromIntegrationId({});

        expect(integrationManager.delegate).toBe(integrationManager);
        expect(integrationManager.delegateTypes).toHaveLength(1);
    });

    it('should get sample contact data', async () => {
        const response = await integrationManager.getSampleData();
        expect(response).toHaveProperty('data');
    });
});
