
let originalParent;

function modalOperations(type) {
  return new Promise((resolve, reject) => {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";

    let span = document.getElementsByClassName("close")[0];
    let modalDiscard = document.getElementById("modalDiscard");
    let modalConfirm = document.getElementById("modalConfirm");
    let modalInput = document.getElementById("modalInput");
    let modalHeading = document.getElementById("modalHeading");
    let modalDescription = document.getElementById("modalDescription");

    let textToCheck =
      type === "reset"
        ? "reset kanban"
        : type === "deleteColumn"
        ? "delete column"
        : "delete permanently";
    modalInput.placeholder = textToCheck;
    modalDescription.innerHTML = `Type <i>${textToCheck}</i> to confirm`;
    if (type === "reset") {
      modalHeading.innerText = "Do you want to reset the entire Kanban board";
    }

    span.onclick = () => {
      modal.style.display = "none";
      reject(false);
    };

    modalDiscard.addEventListener("click", () => {
      modal.style.display = "none";
      reject(false);
    });

    modalConfirm.addEventListener("click", () => {
      if (modalInput.value.trim().toLowerCase() === textToCheck) {
        console.log("working");
        modal.style.display = "none";
        modalInput.value = "";
        resolve(true);
      }
    });

    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
        reject(false);
      }
    };
  });
}

document.getElementById("resetKanban").addEventListener("click", async () => {
  let boards = document.getElementsByClassName("board");
  if (boards.length === 0) return;

  try {
    let result = await modalOperations("reset");
    if (result) {
      document
        .querySelectorAll(".boardsList")
        .forEach((board) => (board.innerHTML = ""));
      console.log("Modal closed successfully");
    }
  } catch (error) {
    console.log("Modal discarded");
  }
});

function getFormattedDate() {
  let date = new Date();
  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = String(date.getFullYear()).slice(-2);

  return `${day}.${month}.${year}`;
}

document.getElementById("newCol").addEventListener("click", (event) => {
  let boardsContainer = document.querySelector(".boardsList");
  if (!boardsContainer) return;

  // Create a new board column
  let boardsDiv = document.createElement("div");
  boardsDiv.classList.add("board");
  boardsDiv.id = `board${Date.now()}`;

  boardsDiv.setAttribute("draggable", "true");
  // Board Head
  let boardHead = document.createElement("div");
  boardHead.classList.add("board-head");

  let boardHeadText = document.createElement("input");
  boardHeadText.classList.add("board-head-text");
  boardHeadText.placeholder = "Start typing here...";

  let boardHeadCount = document.createElement("p");
  boardHeadCount.classList.add("board-head-count");

  boardHead.appendChild(boardHeadText);
  boardHead.appendChild(boardHeadCount);

  // Item List
  let itemList = document.createElement("div");
  itemList.classList.add("item-list");

  // Default Item
  let item = document.createElement("div");
  item.classList.add("item");
  item.addEventListener("dragstart", (event) => {
    item.classList.add("dragging");
    originalParent = item.closest(".board").id;
  });

  item.addEventListener("dragend", () => {
    item.classList.remove("dragging");

    if (!originalParent) return; 

    let originalParentBoardsDiv = document.getElementById(originalParent);
    if (!originalParentBoardsDiv) return; 

    let originalParentBoardsHeadCount =
      originalParentBoardsDiv.querySelector(".board-head-count");
    let originalParentItemsList =
      originalParentBoardsDiv.querySelector(".item-list");

    updateItemCount(originalParentBoardsHeadCount, originalParentItemsList);
    originalParent = "";
  });

  item.setAttribute("draggable", "true");

  let itemText = document.createElement("textarea");
  itemText.classList.add("item-text1");
  itemText.placeholder = "Start Typing here...";

  let itemBtnGrp = document.createElement("div");
  itemBtnGrp.classList.add("item-btn-grp");

  let createdDate = document.createElement("p");
  createdDate.classList.add("created-date");
  createdDate.textContent = getFormattedDate();

  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("button-56");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", async () => {
    let result = await modalOperations("delete");
    if (result) {
      item.remove();
      updateItemCount(boardHeadCount, itemList);
    } else {
      return;
    }
  });

  itemBtnGrp.appendChild(createdDate);
  itemBtnGrp.appendChild(deleteBtn);

  item.appendChild(itemText);
  item.appendChild(itemBtnGrp);
  itemList.appendChild(item);

  // Board Footer
  let boardFoot = document.createElement("div");
  boardFoot.classList.add("board-foot");

  let addItemBtn = document.createElement("button");
  addItemBtn.classList.add("button-6");
  addItemBtn.textContent = "Add Item";
  addItemBtn.addEventListener("click", () => {
    let newItem = item.cloneNode(true);
    newItem.querySelector("textarea").value = "";
    newItem.querySelector(".created-date").textContent = getFormattedDate();

    // maybe future use
    // newItem.id = `item-${Date.now()}`;

    newItem.querySelector(".button-56").addEventListener("click", async () => {
      let result = await modalOperations("delete");
      if (result) {
        newItem.remove();
        updateItemCount(boardHeadCount, itemList);
      }
    });

    newItem.addEventListener("dragstart", (event) => {
      newItem.classList.add("dragging");
      originalParent = newItem.closest(".board").id;
    });

    newItem.addEventListener("dragend", () => {
      item.classList.remove("dragging");

      if (!originalParent) return; 

      let originalParentBoardsDiv = document.getElementById(originalParent);
      if (!originalParentBoardsDiv) return;

      let originalParentBoardsHeadCount =
        originalParentBoardsDiv.querySelector(".board-head-count");
      let originalParentItemsList =
        originalParentBoardsDiv.querySelector(".item-list");

      updateItemCount(originalParentBoardsHeadCount, originalParentItemsList);
      originalParent = "";
    });

    itemList.appendChild(newItem);
    updateItemCount(boardHeadCount, itemList);
  });

  let deleteColumnBtn = document.createElement("button");
  deleteColumnBtn.classList.add("button-6");
  deleteColumnBtn.textContent = "Delete Column";
  deleteColumnBtn.addEventListener("click", async () => {
    let result = await modalOperations("deleteColumn");
    if (result) {
      boardsDiv.remove();
    } else {
      return;
    }
  });

  boardFoot.appendChild(addItemBtn);
  boardFoot.appendChild(deleteColumnBtn);

  boardsDiv.appendChild(boardHead);
  boardsDiv.appendChild(itemList);
  boardsDiv.appendChild(boardFoot);

  // Append the board to the board container
  boardsContainer.appendChild(boardsDiv);
  updateItemCount(boardHeadCount, itemList);
  boardsDiv.addEventListener("dragover", (event) => {
    event.preventDefault();

    const draggedItem = document.querySelector(".dragging");
    if (!draggedItem) return;

    const itemsList = boardsDiv.querySelector(".item-list");

    const items = [...itemsList.querySelectorAll(".item")];

    let closestItem = null;
    let closestOffset = Number.NEGATIVE_INFINITY;


    items.forEach((item) => {
      const box = item.getBoundingClientRect();
      const offset = event.clientY - (box.top + box.height / 2);

      if (offset < 0 && offset > closestOffset) {
        closestOffset = offset;
        closestItem = item;
      }
    });

    if (closestItem) {
      itemsList.insertBefore(draggedItem, closestItem);
    } else {
      itemsList.appendChild(draggedItem);
    }
  });

  boardsDiv.addEventListener("drop", (event) => {
    event.preventDefault();

    const draggedItem = document.querySelector(".dragging");
    if (!draggedItem) return;

    draggedItem.classList.remove("dragging");

    const boardHeadCount = boardsDiv.querySelector(".board-head-count");
    const itemsList = boardsDiv.querySelector(".item-list");
    updateItemCount(boardHeadCount, itemsList);

    if (originalParent) {
      let originalParentBoardsDiv = document.getElementById(originalParent);
      if (originalParentBoardsDiv) {
        let originalParentBoardsHeadCount =
          originalParentBoardsDiv.querySelector(".board-head-count");
        let originalParentItemsList =
          originalParentBoardsDiv.querySelector(".item-list");
        updateItemCount(originalParentBoardsHeadCount, originalParentItemsList);
      }
    }
  });

});


function updateItemCount(countElement, itemList) {
  countElement.textContent = itemList.children.length;
}


document.getElementById("boardsList").addEventListener('drag', (event) => {
  if (event.target.classList.contains("item")) {
      event.stopPropagation();
  } else if (event.target.classList.contains("board")) {
    event.preventDefault()
      console.log(event.target.id)
      const draggedBoard= document.getElementById(event.target.id)
      draggedBoard.classList.add("boardDragging");
      const boardsList =document.getElementById("boardsList")
      const boardItems=[...boardsList.querySelectorAll(".board")]
      console.log(boardItems)
      let closestItem = null;
      let closestOffset = Number.NEGATIVE_INFINITY;

      boardItems.forEach((item)=>{
        const box = item.getBoundingClientRect();
        const offset = event.clientX- (box.left +box.width/2);

        if (offset < 0 && offset > closestOffset) {
          closestOffset = offset;
          closestItem = item;
        }
      })
      
      if (closestItem) {
        boardsList.insertBefore(draggedBoard, closestItem);
      } else {
        boardsList.appendChild(draggedBoard);
      }
  }
});

document.getElementById("boardsList").addEventListener("dragend", (event) => {
  if (event.target.classList.contains("board")) {
    event.target.classList.remove("boardDragging");
  }
});
