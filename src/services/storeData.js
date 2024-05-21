const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore({
  projectId: 'submissionmlgc-m-widyantoro-w',
  keyFilename: './serviceAccountKey.json', 
});

async function storeData(id, data) {
  const predictCollection = firestore.collection('prediction');
  return predictCollection.doc(id).set(data);
}

module.exports = storeData;
