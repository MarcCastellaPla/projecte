const usuaris = db.collection("usuaris");
const grups = db.collection("grups"); // Añadido de la versión 2

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
                                                        <th>Web</th>
                                                    </tr>`;

    // Obtener el documento de "grups" correspondiente al correo electrónico del usuario
    console.log("Abans de selectbyid grups")
    let emailusuari = document.getElementById("loginEmail").value;
    console.log(grups)
    console.log(emailusuari)
    selectById(grups, emailusuari)
        .then((doc) => {
            if (doc.exists) {
                console.log("Despres de selectbyid grups")
                // Filtrar documentos en "usuaris" que tienen una referencia al documento de "grups"
                selectWhere(usuaris, "reference", "==", doc.ref)
                    .then((arrayItems) => {
                        console.log("Elementos obtenidos:", arrayItems);
                        arrayItems.forEach((docItem) => {
                            let logo = "";
                            if (docItem.data().logo != null) {
                                logo = `<img src="${docItem.data().logo}" class="rounded" style="max-width: 100px; max-height: 100px;" alt="${docItem.data().title}">`;
                            }
                            let webLink = docItem.data().web ? `<a href="${docItem.data().web}" target="_blank">Link</a>` : '';
                            let row = `<tr>
                                            <td>${logo}</td>
                                            <td>${docItem.data().aplicacion}</td>
                                            <td>${docItem.data().usuario}</td>
                                            <td id="password-${docItem.id}" data-password="${docItem.data().contrasenya}">*********</td>
                                            <td>${webLink}</td>
                                            <td>
                                                <button type="button" class="btn btn-danger float-right" onclick="eliminar('${docItem.id}', '${docItem.data().logo}')">Eliminar</button>
                                                <button type="button" class="btn btn-primary mr-2 float-right" onclick="editItem('${docItem.id}')">Editar</button>
                                                <button type="button" class="btn btn-secondary mr-2 float-right" onclick="togglePasswordVisibility('${docItem.id}', this)">
                                                    <img src="../Ver.png" alt="Mostrar/Ocultar" style="width: 20px; height: 20px;">
                                                </button>                                                                        
                                                <button type="button" class="btn btn-secondary mr-2 float-right" onclick="copyPassword('${docItem.id}')">
                                                    <img src="../Copiar.png" alt="Copiar" style="width: 20px; height: 20px;">
                                                </button>
                                            </td>
                                        </tr>`;
                            document.getElementById("listItems").innerHTML += row;
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

function togglePasswordVisibility(id, button) {
    const passwordField = document.getElementById(`password-${id}`);
    if (passwordField.textContent === '*********') {
        passwordField.textContent = passwordField.getAttribute('data-password');
        // Cambiar la imagen a la imagen de ocultar
        button.querySelector('img').src = '../Ocultar.png';
    } else {
        passwordField.textContent = '*********';
        // Cambiar la imagen a la imagen de mostrar
        button.querySelector('img').src = '../Ver.png';
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
