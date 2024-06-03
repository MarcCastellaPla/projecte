const usuaris = db.collection("usuaris");
const contrasenyes = db.collection("contrasenyes");

function addUsuari(doc) {
    add(contrasenyes, doc)
        .then(() => {

            document.getElementById("aplicacion").value = "";
            document.getElementById("usuario").value = "";
            document.getElementById("contrasenya").value = "";
            document.getElementById("logo").value = "";
            document.getElementById("web").value = "";


            showAlert("Element guardat correctament", "alert-success");
        })
        .catch(() => {
            showAlert("Error al intentar guardar l'element", "alert-danger");
        });
        loadItems();
}

function deleteItem(id) {
    deleteById(contrasenyes, id)
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
    selectById(contrasenyes, id)
        .then((doc) => {
            document.getElementById("aplicacion").value = doc.data().aplicacion;
            document.getElementById("usuario").value = doc.data().usuario;
            document.getElementById("contrasenya").value = doc.data().contrasenya;
            document.getElementById("thumbnail").src = doc.data().logo;
            document.getElementById("web").value = doc.data().web;
        })
        .catch(() => {
            showAlert("Error al intentar editar l'element", "alert-danger");
        });
}

function loadItems(userEmail) {
    console.log("Cargando elementos...");
    document.getElementById("listItems").innerHTML = `<tr>
                                                        <th>Logo</th>
                                                        <th>Aplicació</th>
                                                        <th>Usuario</th>
                                                        <th>Contraseña</th>
                                                        <th>Web</th>
                                                    </tr>`;

    let emailusuari = document.getElementById("loginEmail").value;
    selectById(usuaris, emailusuari)
        .then((doc) => {
            if (doc.exists) {
                selectWhere(contrasenyes, "reference", "==", doc.ref)
                    .then((arrayItems) => {
                        arrayItems.forEach((docItem) => {
                            let logo = "";
                            if (docItem.data().logo != null) {
                                logo = `<img src="${docItem.data().logo}" class="rounded" style="max-width: 100px; max-height: 100px;" alt="${docItem.data().title}">`;
                            }
                            let webLink;
                            let link = "Link"; 
                            if (docItem.data().web !== undefined) {
                                link = "Link";
                                webLink = docItem.data().web;
                                if (!webLink.startsWith("https://")) {
                                    webLink = "https://" + webLink;
                                }
                            } else {
                                webLink = ""
                                link = "";
                            }
                            
                            let row = `<tr>
                                            <td>${logo}</td>
                                            <td>${docItem.data().aplicacion}</td>
                                            <td>${docItem.data().usuario}</td>
                                            <td id="password-${docItem.id}" data-password="${docItem.data().contrasenya}">*********</td>
                                            <td><a href="${webLink}" target="_blank">${link}</a></td>
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
        button.querySelector('img').src = '../Ocultar.png';
    } else {
        passwordField.textContent = '*********';
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
    updateById(contrasenyes, id, doc)
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
