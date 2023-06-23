const { Options } = require('@friggframework/integrations');
const { loadInstalledModules } = require('@friggframework/core');
const SalesforceManager = require('./entities/SalesforceManager');
const ConnectWiseManager = require('./entities/ConnectWiseManager');
const HubSpotManager = require('./entities/HubSpotManager');

// Entities that we are going to use for integration for this particular app
class IntegrationConfigOptions {
    constructor(params) {
        this.primary = ConnectWiseManager;
        this.options = [

            new Options({
                module: SalesforceManager,
                integrations: [ConnectWiseManager],
                display: {
                    name: 'Salesforce',
                    description: 'Sales & CRM',
                    category: 'Sales & CRM',
                    detailsUrl: 'https://salesforce.com',
                    icon: 'https://friggframework.org/assets/img/salesforce.jpeg',
                },
            }),
            new Options({
                module: HubSpotManager,
                integrations: [ConnectWiseManager],
                display: {
                    name: 'HubSpot',
                    description: 'Sales & CRM, Marketing',
                    category: 'Sales & CRM, Marketing',
                    detailsUrl: 'https://hubspot.com',
                    icon: 'https://friggframework.org/assets/img/hubspot.jpeg',
                },
            }),
        ];
    }

    async getIntegrationOptions() {

        const modules = loadInstalledModules(process.cwd())

        return {
            entities: {
                primary: this.primary.getName(),
                options: this.options.map((val) => val.get()),
                authorized: [],
            },
            integrations: [],
        };
    }
}

module.exports = IntegrationConfigOptions;
