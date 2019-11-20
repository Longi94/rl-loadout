const gltfPipeline = require('gltf-pipeline');
const fs = require('fs');
const os = require('os');
const {Storage} = require('@google-cloud/storage');


const storage = new Storage();

const gltfOptions = {
    dracoOptions: {
        compressionLevel: 7
    },
    keepUnusedElements: true
};

/**
 * Triggered from a change to a Cloud Storage bucket.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.compress = async (event, context) => {
    if (!event.name.endsWith('.glb') || event.name.endsWith('.draco.glb')) {
        return;
    }

    const tmpDir = os.tmpdir();

    const options = {
        destination: tmpDir + '/model.glb',
    };

    const bucket = storage.bucket(event.bucket);

    await bucket.file(event.name).download(options);

    const glb = fs.readFileSync(tmpDir + '/model.glb');
    const results = await gltfPipeline.processGlb(glb, gltfOptions);
    fs.writeFileSync(tmpDir + '/model.draco.glb', results.glb);

    // Uploads a local file to the bucket
    await bucket.upload(tmpDir + '/model.draco.glb', {
        destination: event.name.replace('.glb', '.draco.glb')
    });
};
