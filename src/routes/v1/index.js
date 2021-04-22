import { DIDResolutionResult, Resolver } from 'did-resolver';
import { getResolver } from "infra-did-resolver";
import config from '../../../config.json'

const infraDIDResolver = getResolver(config.resolverConfig);
const resolver = new Resolver({ ...infraDIDResolver })

const prefix = "/1.0";

const testDID = "did:infra:coov:PUB_K1_8PwG7of5B8p9Mpaw6XzeyYtSWJyeSXVtxZhPHQC5eZxZCkqiLU"

module.exports = function(app) {
    app.get(prefix+'/identifiers/:did', async (req, res) => {
        const did = req.params.did;
        const doc = await resolver.resolve(did);
        res.json({
            did: doc
        })
    })
}
