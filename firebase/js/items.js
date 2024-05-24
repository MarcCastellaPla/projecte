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

function add(collection, data) {
    return collection.add(data);
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
        .then((arrayItems) => {
            document.getElementById("listItems").innerHTML = `<tr>
                                                                <th></th>
                                                                <th>Títol</th>
                                                                <th>Contingut</th>
                                                                <th>Imatge</th>
                                                                <th></th>
                                                            </tr>`;
            let promises = arrayItems.map((docItem) => {
                let image = docItem.data().image ? `<img src="${docItem.data().image}" class="rounded" style="max-width: 100px; max-height: 100px;" alt="${docItem.data().title}">` : '';
                return selectById(categories, docItem.data().category)
                    .then((docCategory) => {
                        document.getElementById("listItems").innerHTML += `<tr>
                                                                            <td>${image}</td>
                                                                            <td>${docItem.data().title}</td>
                                                                            <td>${docItem.data().content}</td>
                                                                            <td>${docCategory.data().name}</td>
                                                                            <td>
                                                                                <button type="button" class="btn btn-danger float-right" onclick="deleteItem('${docItem.id}')">
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

            return Promise.all(promises);
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

function selectById(collection, id) {
    return collection.doc(id).get()
        .then((doc) => {
            if (doc.exists) {
                return doc;
            } else {
                throw new Error("No document found with id: " + id);
            }
        });
}
