const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');

async function postPredictHandler(request, h) {
    try {
        const { image } = request.payload;
        const { model } = request.server.app;

        if (!image) {
            return h.response({
                status: 'fail',
                message: 'Gambar tidak ditemukan dalam payload',
            }).code(400);
        }

        const { confidenceScore, suggestion } = await predictClassification(model, image);

        if (confidenceScore === undefined || suggestion === undefined) {
            return h.response({
                status: 'fail',
                message: 'Terjadi kesalahan dalam melakukan prediksi',
            }).code(400);
        }

        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const label = confidenceScore > 0.5 ? 'Cancer' : 'Non-cancer';

        const data = {
            id,
            result: label,
            suggestion,
            confidenceScore,
            createdAt
        };

        await storeData(id, data);

        const response = h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data
        });
        response.code(201);
        return response;
    } catch (error) {
        console.error('Prediction error:', error);
        const response = h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi',
        });
        response.code(400); 
        return response;
    }
}

module.exports = postPredictHandler;
