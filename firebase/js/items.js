// Dentro de items.js

document.getElementById("save").addEventListener("click", function () {
    let id = document.getElementById("elementId").value;
    let title = document.getElementById("title").value;
    let content = document.getElementById("content").value;
    let password = document.getElementById("constrasenya").value; // Obtener la contraseña ingresada
    let image = document.getElementById("image").files[0];

    // Aquí necesitamos obtener el correo electrónico del usuario y la categoría asociada
    let userEmail = document.getElementById("loginEmail").value; // Obtener el correo electrónico del usuario

    // Lógica para obtener la categoría asociada al usuario
    console.log("Email del usuario:", userEmail);
    db.collection("categories").where("name", "==", userEmail).get()
        .then(querySnapshot => {
            console.log("Consulta realizada correctamente.");
            if (!querySnapshot.empty) {
                let categoryRef = querySnapshot.docs[0].ref; // Obtener la referencia a la categoría
                console.log("Categoría encontrada:", categoryRef);

                // Llamar a la función uploadFile con la referencia a la categoría
                uploadFile(image, userEmail, categoryRef)
                    .then((fileData) => {
                        console.log("Archivo subido correctamente.");

                        let imageUrl = fileData.downloadURL;
                        let category = fileData.category; // Aquí ya tenemos la referencia a la categoría
                        console.log("URL de la imagen:", imageUrl);
                        console.log("Categoría del usuario:", category);

                        // Luego de cargar el archivo, añadir el item
                        let doc = {
                            content: content,
                            title: title,
                            image: imageUrl,
                            category: category // Asignar la referencia a la categoría al item
                        };

                        addItem(doc, password);
                    })
                    .catch((error) => {
                        console.error("Error al subir el archivo:", error);
                        showAlert("Error al intentar guardar l'element", "alert-danger");
                    });
            } else {
                console.error("No se encontró una categoría para el usuario:", userEmail);
                showAlert("No se encontró una categoría para el usuario", "alert-danger");
                
                // Si no se encuentra una categoría, creamos una nueva categoría para el usuario
                console.log("Creando una nueva categoría para el usuario:", userEmail);
                db.collection("categories").add({ name: userEmail })
                    .then((categoryDocRef) => {
                        console.log("Nueva categoría creada:", categoryDocRef.id);
                        let categoryRef = categoryDocRef.ref; // Obtener la referencia a la nueva categoría

                        // Llamar a la función uploadFile con la referencia a la nueva categoría
                        uploadFile(image, userEmail, categoryRef)
                            .then((fileData) => {
                                console.log("Archivo subido correctamente.");

                                let imageUrl = fileData.downloadURL;
                                let category = fileData.category; // Aquí ya tenemos la referencia a la categoría
                                console.log("URL de la imagen:", imageUrl);
                                console.log("Categoría del usuario:", category);

                                // Luego de cargar el archivo, añadir el item
                                let doc = {
                                    content: content,
                                    title: title,
                                    image: imageUrl,
                                    category: category // Asignar la referencia a la categoría al item
                                };

                                addItem(doc, password);
                            })
                            .catch((error) => {
                                console.error("Error al subir el archivo:", error);
                                showAlert("Error al intentar guardar l'element", "alert-danger");
                            });
                    })
                    .catch((error) => {
                        console.error("Error al crear una nueva categoría:", error);
                        showAlert("Error al intentar guardar l'element", "alert-danger");
                    });
            }
        })
        .catch((error) => {
            console.error("Error al buscar la categoría del usuario:", error);
            showAlert("Error al buscar la categoría del usuario", "alert-danger");
        });
});
