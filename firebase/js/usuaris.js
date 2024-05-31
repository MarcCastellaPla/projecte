const usuaris = db.collection("usuaris");

function addUsuari(doc) {
    add(usuaris, doc)
        .then(() => {
            // loadItems();

            document.getElementById("aplicacion").value = "";
            document.getElementById("usuario").value = "";
            document.getElementById("contrasenya").value = "";
            document.getElementById("logo").value = "";

            showAlert("Element guardat correctament", "alert-success");
        })
        .catch(() => {
            showAlert("Error al intentar guardar l'element", "alert-danger");
        });
}

function deleteItem(id) {
    deleteById(usuaris, id)
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
    selectById(usuaris, id)
        .then((doc) => {
            document.getElementById("aplicacion").value = doc.data().aplicacion;
            document.getElementById("usuario").value = doc.data().usuario;
            document.getElementById("contrasenya").value = doc.data().contrasenya;
            document.getElementById("thumbnail").src = doc.data().logo;
        })
        .catch(() => {
            showAlert("Error al intentar editar l'element", "alert-danger");
        });
}

function loadItems(userEmail) {
    console.log("Cargando elementos...");
    // Limpiar la tabla antes de cargar nuevos elementos
    document.getElementById("listItems").innerHTML = `<tr>
                                                        <th>Logo</th>
                                                        <th>Aplicació</th>
                                                        <th>Usuario</th>
                                                        <th>Contraseña</th>
                                                    </tr>`;

    // Obtener el documento de "grups" correspondiente al correo electrónico del usuario
    selectById(grups, userEmail)
        .then((doc) => {
            if (doc.exists) {
                // Filtrar documentos en "usuaris" que tienen una referencia al documento de "grups"
                selectWhere(usuaris, "reference", "==", doc.ref)
                    .then((arrayItems) => {
                        console.log("Elementos obtenidos:", arrayItems);
                        arrayItems.forEach((docItem) => {
                            let logo = "";
                            if (docItem.data().logo != null) {
                                logo = `<img src="${docItem.data().logo}" class="rounded" style="max-width: 100px; max-height: 100px;" alt="${docItem.data().title}">`;
                            }
                            document.getElementById("listItems").innerHTML += `<tr>
                                                                                <td>${logo}</td>
                                                                                <td>${docItem.data().aplicacion}</td>
                                                                                <td>${docItem.data().usuario}</td>
                                                                                <td id="password-${docItem.id}" data-password="${docItem.data().contrasenya}">*********</td>
                                                                                <td>
                                                                                    <button type="button" class="btn btn-danger float-right" onclick="eliminar('${docItem.id}', '${docItem.data().logo}')">Eliminar</button>
                                                                                    <button type="button" class="btn btn-primary mr-2 float-right" onclick="editItem('${docItem.id}')">Editar</button>
                                                                                    <button type="button" class="btn btn-secondary mr-2 float-right" onclick="togglePasswordVisibility('${docItem.id}')">Mostrar/Ocultar</button>
                                                                                    <button type="button" class="btn btn-secondary mr-2 float-right" onclick="copyPassword('${docItem.id}')">Copiar</button>
                                                                                </td>
                                                                            </tr>`;
                        });
                    })
                    .catch((error) => {
                        console.error("Error al obtener elementos de 'usuaris':", error);
                        showAlert("Error al mostrar els elements", "alert-danger");
                    });
            } else {
                console.log("El usuario no tiene un documento correspondiente en 'grups'");
                // Puedes mostrar un mensaje o manejar la situación de otra manera según sea necesario
            }
        })
        .catch((error) => {
            console.error("Error al obtener el documento de 'grups' por ID:", error);
            showAlert("Error al mostrar els elements", "alert-danger");
        });
}






function togglePasswordVisibility(id) {
    const passwordField = document.getElementById(`password-${id}`);
    if (passwordField.textContent === '*********') {
        passwordField.textContent = passwordField.getAttribute('data-password');
    } else {
        passwordField.textContent = '*********';
    }
}

function copyPassword(id) {
    const passwordField = document.getElementById(`password-${id}`);
    const password = passwordField.getAttribute('data-password');

    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = password;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);

    showAlert("Contrasenya copiada al porta-retalls", "alert-success");
}
function updateItem(id, doc) {
    updateById(usuaris, id, doc)
        .then(() => {
            loadItems();

            document.getElementById("elementId").value = "";
            document.getElementById("aplicacion").value = "";
            document.getElementById("usuario").value = "";
            document.getElementById("contrasenya").value = "";
            document.getElementById("logo").value = "";
            document.getElementById("thumbnail").style.visibility = "hidden";

            showAlert("Element actualitzat correctament", "alert-success");
        })
        .catch(() => {
            showAlert("Error al intentar actualitzat l'element", "alert-danger");
        });
}
function generatePassword(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}