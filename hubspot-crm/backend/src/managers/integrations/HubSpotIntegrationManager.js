const { IntegrationManager } = require('@friggframework/integrations');
const {get} = require("@friggframework/assertions");

class HubSpotIntegrationManager extends IntegrationManager {
    static Config = {
        name: 'hubspot',
        version: '1.0.0',
        supportedVersions: ['1.0.0'],
        events: ['EXAMPLE_EVENT'],
    };

    constructor(params) {
        super(params);
    }

    /**
     * HANDLE EVENTS
     */
    async receiveNotification(notifier, event, object = null) {
        this.primaryInstance = notifier.primaryInstance;
        this.targetInstance = notifier.targetInstance;
        this.integration = notifier.integration;
        if (event === 'EXAMPLE_EVENT') {
            return this.processReportData(object);
        }
    }

    /**
     * ALL CUSTOM/OPTIONAL METHODS FOR AN INTEGRATION MANAGER
     */
    async getSampleData() {
        const res = await this.targetInstance.api.searchDeals()
        console.log(res.results.length)
        const formatted = res.results.map(deal => {
            const formattedDeal = {
                id: deal.id,
                name: deal.properties.dealname,
                dealStage: deal.properties.dealstage,
                daysToClose: deal.properties.days_to_close,
                createdAt: deal.createdAt,
                closeDate: deal.properties.closedate,
            }


            return formattedDeal
        })
        return {data: formatted}

    }

    /**
     * ALL REQUIRED METHODS FOR AN INTEGRATION MANAGER
     */
    async processCreate(params) {
        // Validate that we have all of the data we need
        // Set integration status as makes sense. Default ENABLED
        // TODO turn this into a validateConfig method/function
        this.integration.status = 'NEEDS_CONFIG';
        await this.integration.save();
    }

    async processUpdate(params) {
        const newConfig = get(params, 'config');
        const oldConfig = this.integration.config;
        // Just save whatever
        this.integration.markModified('config');
        await this.integration.save();
        return this.validateConfig();
    }

    async processDelete(params) {}

    async getConfigOptions() {
        const options = {}
        return options;
    }
}

module.exports = HubSpotIntegrationManager;
