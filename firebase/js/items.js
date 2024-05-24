// items.js
const items = db.collection("items");
const categories = db.collection("categories");

function addItem(doc) {
    add(items, doc)
        .then(() => {
            loadItems();

            document.getElementById("title").value = "";
            document.getElementById("content").value = "";
            document.getElementById("image").value = "";

            showAlert("Element guardat correctament", "alert-success");
        })
        .catch(() => {
            showAlert("Error al intentar guardar l'element", "alert-danger");
        });
}

function deleteItem(id) {
    deleteById(items, id)
        .then(() => {
            loadItems();
            showAlert("Element eliminat correctament", "alert-success");
        }).catch(() => {
            showAlert("Error al intentar eliminar l'element", "alert-danger");
        });
}

function editItem(id) {
    document.getElementById("elementId").value = id;
    document.getElementById("thumbnail").style.visibility = "visible";
    selectById(items, id)
        .then((doc) => {
            document.getElementById("title").value = doc.data().title;
            document.getElementById("content").value = doc.data().content;
            document.getElementById("thumbnail").src = doc.data().image;
        })
        .catch(() => {
            showAlert("Error al intentar editar l'element", "alert-danger");
        });
}

function loadItems() {
    selectAll(items)
    // selectAll(items, "title")
    // selectWhere(items, "title", "==", "Firma")
    // selectLike(items, "title", "F")
        .then((arrayItems) => {
            document.getElementById("listItems").innerHTML = `<tr>
																<th>Imatge</th>
																<th>Aplicació</th>
																<th>Usuari</th>
																<th>Contrasenya</th>
															</tr>`;
            arrayItems.forEach((docItem) => {
                let image = "";
                if (docItem.data().image != null) {
                    image = `<img src="${docItem.data().image}" class="rounded" style="max-width: 100px; max-height: 100px;" "alt="${docItem.data().title}">`;
                }
                selectById(categories, docItem.data().category.id)
                    .then((docCategory) => {
                        document.getElementById("listItems").innerHTML += `<tr>
                                                                        <td>${image}</td>
                                                                        <td>${docItem.data().title} - ${docCategory.data().name}</td>
                                                                        <td>${docItem.data().content}</td>
                                                                        <td>
                                                                            <button type="button" class="btn btn-danger float-right" onclick="eliminar('${docItem.id}', '${docItem.data().image}')">
                                                                                Eliminar
                                                                            </button>
                                                                            <button type="button" class="btn btn-primary mr-2 float-right" onclick="editItem('${docItem.id}')">
                                                                                Editar
                                                                            </button>
                                                                        </td>
                                                                    </tr>`;
                    })
                    .catch(() => {
                        showAlert("Error al mostrar els elements", "alert-danger");
                    });
            });
        })
        .catch(() => {
            showAlert("Error al mostrar els elements", "alert-danger");
        });
}

function updateItem(id, doc) {
    updateById(items, id, doc)
        .then(() => {
            loadItems();

            document.getElementById("elementId").value = "";
            document.getElementById("title").value = "";
            document.getElementById("content").value = "";
            document.getElementById("image").value = "";
            document.getElementById("thumbnail").style.visibility = "hidden";

            showAlert("Element actualitzat correctament", "alert-success");
        })
        .catch(() => {
            showAlert("Error al intentar actualitzat l'element", "alert-danger");
        });
}
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
                            category: category, // Asignar la referencia a la categoría al item
                            email: userEmail // Añadir el correo electrónico del usuario
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
                                    category: category, // Asignar la referencia a la categoría al item
                                    email: userEmail // Añadir el correo electrónico del usuario
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
