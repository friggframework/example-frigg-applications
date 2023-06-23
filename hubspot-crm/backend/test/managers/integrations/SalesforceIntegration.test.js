const SalesforceIntegrationManager = require('../../../src/managers/integrations/SalesforceIntegrationManager');
const MockAPI = require('../../../src/modules/HubSpot/mocks/apiMock');

const testUserId = 9001;

function MockedEntity() {
    return {
        get: (id) => {
            return {
                _id: id,
                user: testUserId,
            };
        },
    };
}

function MockedIntegration() {
    return {
        create: () => {
            return {
                entities: [{}, {}],
            };
        },
    };
}

jest.mock('@friggframework/models', () => {
    return {
        Entity: MockedEntity,
        Integration: MockedIntegration,
    };
});

SalesforceIntegrationManager.EntityManagerClass = {
    getEntityManagerInstanceFromEntityId: async () => {
        return {
            getName: () => 'hubspot',
            // instance: {
            //     isSet: true,
            //     api: MockAPI,
            // },
            api: new MockAPI(),
        };
    },
};

SalesforceIntegrationManager.integrationTypes = ['hubspot'];
SalesforceIntegrationManager.integrationManagerClasses = [
    SalesforceIntegrationManager,
];

describe('HubSpot Integration Manager', () => {
    let integrationManager;
    beforeAll(async () => {
        const entities = ['primaryEntityId', 'targetEntityId'];
        const config = {
            type: 'hubspot',
        };
        integrationManager = await SalesforceIntegrationManager.createIntegration(
            entities,
            testUserId,
            config
        );

        expect(integrationManager.delegate).toBe(integrationManager);
        expect(integrationManager.delegateTypes).toHaveLength(1);
    });

    it('should get sample contact data', async () => {
        const response = await integrationManager.getSampleData();
        expect(response).toHaveProperty('data');
    });
});
