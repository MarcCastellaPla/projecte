const contrasenyes = db.collection("contrasenyes");
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

function loadItems() {
    selectAll(usuaris)
    // selectAll(items, "title")
    // selectWhere(items, "title", "==", "Firma")
    // selectLike(items, "title", "F")
        .then((arrayItems) => {
            document.getElementById("listItems").innerHTML = `<tr>
																<th>Logo</th>
																<th>Aplicació</th>
																<th>Usuario</th>
																<th>Contraseña</th>
															</tr>`;
            arrayItems.forEach((docItem) => {
                let logo = "";
                if (docItem.data().logo != null) {
                    logo = `<img src="${docItem.data().logo}" class="rounded" style="max-width: 100px; max-height: 100px;" "alt="${docItem.data().title}">`;
                }
                selectAll(usuaris)
                    .then((docCategory) => {
                        document.getElementById("listItems").innerHTML += `<tr>
                                                                        <td>${logo}</td>
                                                                        <td>${docItem.data().aplicacion}</td>
                                                                        <td>${docItem.data().usuario}</td>
                                                                        <td><span id="contrasenyaOculta">${docItem.data().contrasenya}</span><button id="botoContrasenya">Mostrar/Ocultar</button><button id="botoCopiarContrasenya">Copiar</button></td>
                                                                        <td>
                                                                            <button type="button" class="btn btn-danger float-right" onclick="eliminar('${docItem.id}', '${docItem.data().logo}')">
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