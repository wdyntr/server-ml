const tf = require('@tensorflow/tfjs-node');
// const path = require('path')

async function loadModel() {
    // const model = path.resolve(__dirname, '../../../models/model.json')
    return tf.loadGraphModel(`https://storage.googleapis.com/models-mlgc/models/model.json`);
}

module.exports = loadModel;