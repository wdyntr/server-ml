const tf = require('@tensorflow/tfjs-node');

async function predictClassification(model, imageBuffer) {
    try {
        let tensor = tf.node.decodeImage(imageBuffer)  // Memastikan gambar memiliki 3 saluran (RGB)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .expandDims();

        if (tensor.shape[3] !== 3) {
            throw new Error();
        }

        const prediction = model.predict(tensor);
        const confidenceScore = prediction.dataSync()[0]; 

        let suggestion = '';
        if (confidenceScore > 0.5) {
            suggestion = 'Segera konsultasikan ke dokter.';
        } else {
            suggestion = 'Tidak perlu khawatir, tetap jaga kesehatan.';
        }

        return {
            confidenceScore,
            suggestion
        };
    } catch (error) {
        // console.error('Prediction error:', error);
        return { confidenceScore: undefined, suggestion: undefined };
    }
}

module.exports = predictClassification;
