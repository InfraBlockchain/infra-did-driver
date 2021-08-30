import { DIDResolutionResult, Resolver } from 'did-resolver';
import { getResolver } from "infra-did-resolver";
import config from '../../../config.json';
import InfraDID from 'infra-did-js';
import didJWT from 'did-jwt';

const infraDIDResolver = getResolver(config.resolverConfig);
const resolver = new Resolver({ ...infraDIDResolver })

const prefix = "/1.0";

const testDID = "did:infra:coov:PUB_K1_8PwG7of5B8p9Mpaw6XzeyYtSWJyeSXVtxZhPHQC5eZxZCkqiLU"

const confBlockchainNetwork = {
    networkId: '01',
    registryContract: process.env.REGISTRY_CONTRACT,
    rpcEndpoint: process.env.RPC_ENDPOINT,
    txfeePayerAccount: process.env.TX_FEE_PAYER_ACCOUNT,
    txfeePayerPrivateKey: process.env.TX_FEE_PAYER_PRIVATE_KEY,
}

module.exports = function (app) {
    app.get(prefix + '/identifiers/:did/status', async (req, res) => {
        const did = req.params.did;
        const doc = await resolver.resolve(did);
        res.json({ isRevoked: doc?.didDocumentMetadata?.disabled === true })
    })
    app.get(prefix + '/identifiers/:did', async (req, res) => {
        const did = req.params.did;
        const doc = await resolver.resolve(did);
        res.json(doc);
        // res.send(JSON.stringify(doc, undefined, 2))
    })
    app.get(prefix + '/generate', async (req, res) => {
        const networkId = '01';
        const identity = InfraDID.createPubKeyDIDsecp256k1(networkId)
        res.json(identity);
    })
    app.get(prefix + '/generate/:networkId', async (req, res) => {
        const networkId = req.params.networkId
        const identity = InfraDID.createPubKeyDIDsecp256k1(networkId)
        res.json(identity);
    })

    const mocaPrefix = '/api/v1';

    app.post(mocaPrefix + '/generate', async (req, res) => {
        const networkId = '01';
        const identity = InfraDID.createPubKeyDIDsecp256k1(networkId)
        res.json(identity);
    })

    app.post(mocaPrefix + '/revoke/:did', async (req, res) => {
        const did = req.params.did;
        const { privateKey } = req.body;
        const conf = {
            ...confBlockchainNetwork,
            did: did,
            didOwnerPrivateKey: privateKey,
        }
        console.log(conf);
        const api = new InfraDID(conf);
        const revoked = await api.revokePubKeyDID();
        res.json(revoked);
    })
    app.post(mocaPrefix + '/verify', async(req, res) => {
        const { jwt, audience, challenge} = req.body;
        console.log(req.body);
        const verified = await didJWT.verifyJWT(jwt, {
            resolver: resolver,
            // audience: audience
        })
        let result = true;
        if (verified.didResolutionResult.didDocumentMetadata.deactivated) {
            result = false;
        }
        res.json({
            result: result,
            resolved: verified
        });
    })

}
