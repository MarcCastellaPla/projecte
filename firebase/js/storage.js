// storage.js

const storage = firebase.storage();

// Función para eliminar un archivo del almacenamiento
function deleteFile(url) {
    return new Promise((resolve, reject) => {
        storage.refFromURL(url).delete()
            .then(() => {
                resolve();
            })
            .catch((error) => {
                console.error('Error al eliminar el archivo:', error);
                reject(error);
            });
    });
}

// Función para subir un archivo al almacenamiento
function uploadFile(file, userEmail) {
    console.log("Iniciando carga de archivo...");
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            console.log("Archivo cargado correctamente.");
            let randomId = Math.random().toString(36).substr(2);
            let userCategory = null;

            if (userEmail) {
                console.log("Correo electrónico del usuario:", userEmail);
                db.collection("categories").where("name", "==", userEmail).get()
                    .then(querySnapshot => {
                        console.log("Consulta realizada correctamente.");
                        if (!querySnapshot.empty) {
                            userCategory = querySnapshot.docs[0].id;
                            console.log("Categoría del usuario encontrada:", userCategory);
                        } else {
                            return db.collection("categories").add({ name: userEmail });
                        }
                    })
                    .then(categoryDocRef => {
                        console.log("Categoría del usuario añadida correctamente.");
                        if (categoryDocRef) {
                            userCategory = categoryDocRef.id;
                            console.log("Categoría del usuario:", userCategory);
                        }
                        return storage.ref().child('images/items/' + randomId).putString(reader.result, "data_url");
                    })
                    .then((snapshot) => {
                        console.log("Archivo subido correctamente.");
                        return snapshot.ref.getDownloadURL();
                    })
                    .then(downloadURL => {
                        resolve({ downloadURL, category: userCategory });
                    })
                    .catch((error) => {
                        reject(error);
                    });
            } else {
                console.error("El correo electrónico del usuario no está definido.");
                reject(new Error("userEmail is undefined"));
            }
        }
    });
}
