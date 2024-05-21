const { Firestore } = require('@google-cloud/firestore');

// Pastikan Anda memiliki credential atau proyek ID yang benar
const firestore = new Firestore({
  projectId: 'submissionmlgc-m-widyantoro-w',
  keyFilename: './serviceAccountKey.json', // Atau sesuaikan dengan lokasi file kredensial Anda
});

async function storeData(id, data) {
  const predictCollection = firestore.collection('prediction');
  return predictCollection.doc(id).set(data);
}

module.exports = storeData;
