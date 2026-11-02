const parts = {
    armsAndAccessories: {
        folder: "arms_and_accessories",
        count: 11
    },
    body: {
        folder: "body",
        count: 1
    },
    ears: {
        folder: "ears",
        count: 4
    },
    eyebrows: {
        folder: "eyebrows",
        count: 8
    },
    eyes: {
        folder: "eyes",
        count: 5
    },
    glassesAndAccessories: {
        folder: "glasses_and_accessories",
        count: 8
    },
    hair: {
        folder: "hair_and_facial_hair",
        count: 9
    },
    hats: {
        folder: "hats",
        count: 6
    },
    mouths: {
        folder: "mouths",
        count: 11
    },
    noses: {
        folder: "noses",
        count: 6
    },
    shoes: {
        folder: "shoes",
        count: 8
    }
};

const categorySelect = document.querySelector("#category");
const partsDiv = document.querySelector("#parts");
const stage = document.querySelector("#stage");
const sceneSelect = document.querySelector("#scene");
let selectedPart = null;
let highestZ = 1;

function saveCurrent() {
    const placed = [...stage.querySelectorAll(".placed-part")].map(img => ({
        src: img.getAttribute("src"), left: img.style.left, top: img.style.top,
        width: img.style.width, angle: Number(img.dataset.angle), z: Number(img.style.zIndex)
    }));
    localStorage.setItem("potatoCurrent", JSON.stringify({ scene: sceneSelect.value, placed }));
}

function selectPart(img) {
    stage.querySelectorAll(".placed-part").forEach(part => part.classList.remove("selected"));
    selectedPart = img;
    if (img) {
        img.classList.add("selected");
        img.style.zIndex = ++highestZ;
    }
}

function addPart(src, saved = null) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Potato accessory";
    img.draggable = false;
    img.className = "placed-part";
    img.style.left = saved?.left ?? "44%";
    img.style.top = saved?.top ?? "40%";
    img.style.width = saved?.width ?? "90px";
    img.style.zIndex = saved?.z ?? ++highestZ;
    img.dataset.angle = saved?.angle ?? 0;
    img.style.transform = `rotate(${img.dataset.angle}deg)`;
    highestZ = Math.max(highestZ, Number(img.style.zIndex));
    stage.appendChild(img);
    img.addEventListener("pointerdown", event => {
        event.preventDefault();
        selectPart(img);
        const rect = stage.getBoundingClientRect();
        const imageRect = img.getBoundingClientRect();
        const offsetX = event.clientX - imageRect.left;
        const offsetY = event.clientY - imageRect.top;
        img.setPointerCapture(event.pointerId);
        function move(e) {
            img.style.left = `${((e.clientX - rect.left - offsetX) / rect.width) * 100}%`;
            img.style.top = `${((e.clientY - rect.top - offsetY) / rect.height) * 100}%`;
        }
        function stop() {
            img.removeEventListener("pointermove", move);
            img.removeEventListener("pointerup", stop);
            img.removeEventListener("pointercancel", stop);
            saveCurrent();
        }
        img.addEventListener("pointermove", move);
        img.addEventListener("pointerup", stop);
        img.addEventListener("pointercancel", stop);
    });
    selectPart(img);
    saveCurrent();
}

categorySelect.addEventListener("change", () => {
    partsDiv.innerHTML = "";

    const selectedCategory = categorySelect.value;
    const category = parts[selectedCategory];

    if (!category) {
        return;
    }

    for (let i = 1; i <= category.count; i++) {
        const number = String(i).padStart(2, "0");

        const file = `${category.folder}_${number}.png`;

        const img = document.createElement("img");

        img.src = `images/${category.folder}/${file}`;
        img.alt = file.replace(".png", "");
        img.className = "part";

        img.addEventListener("click", () => {
            addPart(img.getAttribute("src"));
        });

        partsDiv.appendChild(img);
    }
});

const backgrounds = {
    beach: "beach.png",
    birthday: "birthday_party.png",
    garden: "garden.png",
    outerSpace: "outer_space.png",
    theater: "theater_stage.png",
    toyRoom: "toy_room.png"
};

function changeScene() {
    const selectedScene = sceneSelect.value;

    if (backgrounds[selectedScene]) {
        stage.style.backgroundImage =
            `url("images/backgrounds/${backgrounds[selectedScene]}")`;
    } else {
        stage.style.backgroundImage =
            "linear-gradient(135deg, #ffe0e8, #d7c7ff)";
    }

    saveCurrent();
}
sceneSelect.addEventListener("change", changeScene);

function editSelected(action) {
    if (!selectedPart) return;
    if (action === "delete") {
        selectedPart.remove();
        selectedPart = null;
    } else if (action === "rotate") {
        selectedPart.dataset.angle = (Number(selectedPart.dataset.angle) + 15) % 360;
        selectedPart.style.transform = `rotate(${selectedPart.dataset.angle}deg)`;
    } else {
        const current = parseFloat(selectedPart.style.width);
        selectedPart.style.width = `${Math.max(25, current + (action === "bigger" ? 10 : -10))}px`;
    }
    saveCurrent();
}
["smaller", "bigger", "rotate", "delete"].forEach(id => {
    document.getElementById(id).addEventListener("click", () => editSelected(id));
});
document.querySelector("#clear").addEventListener("click", () => {
    stage.querySelectorAll(".placed-part").forEach(img => img.remove());
    selectedPart = null;
    saveCurrent();
});

const savedSelect = document.querySelector("#saved");
function allSaved() { return JSON.parse(localStorage.getItem("potatoPictures") || "{}"); }
function refreshSaved() {
    savedSelect.innerHTML = '<option value="">Choose a saved picture</option>';
    Object.keys(allSaved()).forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        savedSelect.appendChild(option);
    });
}
function restore(picture) {
    stage.querySelectorAll(".placed-part").forEach(img => img.remove());
    selectedPart = null;
    sceneSelect.value = picture.scene || "";
    changeScene();
    (picture.placed || []).forEach(part => addPart(part.src, part));
    saveCurrent();
}
document.querySelector("#save").addEventListener("click", () => {
    const name = document.querySelector("#pictureName").value.trim();
    if (!name) return alert("Please name your picture first.");
    const pictures = allSaved();
    pictures[name] = JSON.parse(localStorage.getItem("potatoCurrent") || '{}');
    localStorage.setItem("potatoPictures", JSON.stringify(pictures));
    refreshSaved();
    savedSelect.value = name;
});
document.querySelector("#load").addEventListener("click", () => {
    const picture = allSaved()[savedSelect.value];
    if (picture) restore(picture);
});
document.querySelector("#deleteSaved").addEventListener("click", () => {
    const pictures = allSaved();
    if (!savedSelect.value) return;
    delete pictures[savedSelect.value];
    localStorage.setItem("potatoPictures", JSON.stringify(pictures));
    refreshSaved();
});

// Optional music files: music/happy.mp3, music/bouncy.mp3, music/dreamy.mp3.
const player = new Audio();
player.loop = true;
const musicButton = document.querySelector("#music");
musicButton.addEventListener("click", async () => {
    if (!player.paused) {
        player.pause();
        musicButton.textContent = "♫ Play music";
        return;
    }
    player.src = `music/${document.querySelector("#song").value}.mp3`;
    try {
        await player.play();
        musicButton.textContent = "♫ Pause music";
    } catch {
        alert("Add your music files to the music folder to enable music.");
    }
});
document.querySelector("#song").addEventListener("change", () => {
    if (!player.paused) {
        player.src = `music/${document.querySelector("#song").value}.mp3`;
        player.play().catch(() => { musicButton.textContent = "♫ Play music"; });
    }
});

refreshSaved();
const previous = JSON.parse(localStorage.getItem("potatoCurrent") || "null");
if (previous) restore(previous);