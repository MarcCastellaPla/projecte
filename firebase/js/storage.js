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
                            // Si se encuentra una categoría para el usuario, se asigna
                            userCategory = querySnapshot.docs[0].id;
                            console.log("Categoría del usuario encontrada:", userCategory);
                        } else {
                            // No se encontró una categoría para el usuario, la creamos
                            console.log("No se encontró una categoría para el usuario, creando una nueva...");
                            return db.collection("categories").add({ name: userEmail });
                        }
                    })
                    .then(categoryDocRef => {
                        if (!userCategory && categoryDocRef) {
                            // Si no se encontró una categoría y se creó una nueva, se asigna
                            userCategory = categoryDocRef.id;
                            console.log("Categoría del usuario creada:", userCategory);
                        }
                        // Subimos el archivo al almacenamiento
                        return storage.ref().child('images/items/' + randomId).putString(reader.result, "data_url");
                    })
                    .then((snapshot) => {
                        console.log("Archivo subido correctamente.");
                        return snapshot.ref.getDownloadURL();
                    })
                    .then(downloadURL => {
                        // Resolvemos la promesa con la URL de descarga y la categoría del usuario
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


