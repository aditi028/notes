localDataStorage = window.localStorage;
let data = localDataStorage;

let editor;
let colors = [ 
                "rgb(201, 233, 245)", 
                "rgb(245, 206, 184)", 
                "rgb(181, 223, 178)", 
                "rgb(253, 240, 172)"
            ];

let colorBottomBorders = [
    "rgb(60,170,195)",
    "rgb(160, 26, 46)",
    "rgb(63, 156, 53)",
    "rgb(254, 195, 3)",

];

class NoteWrapper{
    constructor(id,title,note,time){
        this.id = id;
        this.title = title;
        this.note = note;
        this.modifiedTime= time;
    }

    getDetails() {
        console.log(
            "ID -> ", this.id,
            "TITLE -> ",this.title,
            "NOTE -> ",this.note,
            "MODIFIED TIME -> ",this.modifiedTime
        );
    }
}

function formatTime(time){
    // (note: timezone has been considered while rendering.)  
    time = new Date(time); 
    const splited_date = time.toString().split(" ");
    const year = splited_date[3];
    const date =  parseInt(splited_date[2]);
    const month = splited_date[1];
    const day = splited_date[0];
    let formatted_date  = date+" "+month+" "+year;
    return formatted_date;
}

function getModifiedTime(past){

    let modifiedTime = "0 min ago";
    let current = Date.now();
    
    let diffInMilliSec = current - past;
    let diffInSec = Math.floor(diffInMilliSec/1000);
    let diffInMin = Math.floor(diffInSec/60);
    let diffInHours = Math.floor(diffInMin/60);
    let diffInDays = Math.floor(diffInHours/24);
    
    if(diffInDays >= 2){
        modifiedTime = formatTime(past);
    }
    else if(diffInDays==1){
        modifiedTime = "1 day ago";
    }
    else if(diffInHours>=1){
        modifiedTime = diffInHours + " hrs ago";
        if(diffInHours==1){
            modifiedTime = diffInHours + " hr ago";
        }
    }
    else if(diffInMin>=1){
        modifiedTime = diffInMin + " mins ago";
        if(diffInMin==1){
            modifiedTime = diffInMin + " min ago";
        }
    }
    else{
       modifiedTime = "0 min ago";
    }
    return modifiedTime;

}


document.addEventListener("DOMContentLoaded", loadNotesInScrollView);

function loadNotesInScrollView(){
    let scrollView = document.getElementById("notesScrollView");
    data = JSON.parse(localStorage.getItem('notesList')); 
    if(data==null || data.length==0){
       let noNotesFoundDiv = createNoNotesDiv();
       scrollView.appendChild(noNotesFoundDiv);
    } 
    else{
        data = data.sort((a, b) => parseInt(b.modifiedTime) - parseInt(a.modifiedTime));
        let item;
        let colorIndex=0;//adds colors to notes.
        for(item in data){
           let id = data[item]['id'];
           let title = data[item]['title'];
           let note = data[item]['note'];
           let modifiedTime = data[item]['modifiedTime'];
           const note_item = new NoteWrapper(id,title,note,modifiedTime);
           item = createScrollViewItem(note_item,colorIndex);
           scrollView.appendChild(item);
           colorIndex++;
           if(colorIndex == 4){
               colorIndex = 0;
           }
        }
    }
}

function createNoNotesDiv(){
    let noNotesFoundDiv = document.createElement("div");
    noNotesFoundDiv.setAttribute("class","noNotes");
    let div_text = document.createElement("p");
    div_text.setAttribute("class","noNotesText");
    div_text.innerHTML = "no notes found.";
    let div_image = document.createElement("div");
    div_image.setAttribute("class","noNotesImage");
    noNotesFoundDiv.appendChild(div_image);
    noNotesFoundDiv.appendChild(div_text);
    return noNotesFoundDiv;
}

// function fetchData(){
//     if(localDataStorage.length==0) return;
//     data = JSON.parse(localStorage.getItem('notesList'));
//     if(data==null){
//         console.log("data == null");
//         return;
//     } 
//     console.log("jsonify data -> ",data, "type of->", typeof data);
//     if(data.length==0){
//         console.log("fetchdata -> no data found ");
//     }
//     for (let item in data) {
//         console.log("item ",item," data ",data[item]);
//         console.log("title ",data[item][1]);
//     }
// }

function createScrollViewItem(noteInstance,colorIndex){
    let scrollViewItem = document.createElement("div");
    let itemHeader = createScrollViewItemHeader(noteInstance,colorIndex);
    let itemBody = createScrollViewItemBody(noteInstance.note,colorIndex);
    scrollViewItem.appendChild(itemHeader);
    scrollViewItem.appendChild(itemBody);
    scrollViewItem.setAttribute("class","card");
    scrollViewItem.addEventListener('click', function(){
        handleNoteClick(noteInstance,colorIndex);
    });
    return scrollViewItem;
}

function createScrollViewItemHeader(noteInstance,colorIndex){
    let itemHeader = document.createElement("div");
    itemHeader.setAttribute('class', 'cardHeader' );
    itemHeader.style.backgroundColor = colors[colorIndex];
    //create title
    let itemTitle = document.createElement("div");
    itemTitle.setAttribute('class', 'cardTitle' );
    let itemTitleText = document.createElement("h3");
    itemTitleText.innerHTML = noteInstance.title;
    itemTitle.appendChild(itemTitleText);
    //create separator icon
    let itemSeparator = document.createElement("div");
    itemSeparator.setAttribute('class', 'separatorIcon' );
    let separatorIcon = document.createElement("i");
    separatorIcon.setAttribute('class', 'material-icons' );
    separatorIcon.innerHTML = "fiber_manual_record";
    itemSeparator.appendChild(separatorIcon);
    //create created time
    let itemTime = document.createElement("div");
    itemTime.setAttribute('class', 'createdTime' );
    let itemTimeText = document.createElement("h6");
    itemTimeText.innerHTML = getModifiedTime(noteInstance.modifiedTime);
    itemTime.appendChild(itemTimeText);
    //create delete icon
    let itemDelete = document.createElement("div");
    itemDelete.setAttribute('class', 'deleteCard' );
    let deleteIcon = document.createElement("i");
    deleteIcon.setAttribute('class', 'material-icons' );
    deleteIcon.innerHTML = "delete";
    itemDelete.appendChild(deleteIcon);
    itemDelete.addEventListener('click', function(event){
        event.stopPropagation();
        let save_note=0;
        let delete_note=1;
        displayPopUp(save_note,delete_note,noteInstance);
    });
    //append all children
    itemHeader.appendChild(itemTitle);
    itemHeader.appendChild(itemSeparator);
    itemHeader.appendChild(itemTime);
    itemHeader.appendChild(itemDelete);
    return itemHeader;
}

function createScrollViewItemBody(note,colorIndex){
    let itemBody = document.createElement("div");
    itemBody.setAttribute('class', 'cardBody');
    itemBody.style.backgroundColor = colors[colorIndex];
    let itemBodyContent = document.createElement("p");
    itemBodyContent.setAttribute('class', 'cardBodyContent');
    itemBodyContent.innerHTML = note;
    itemBody.appendChild(itemBodyContent);
    return itemBody;
}

function handleNoteClick(noteInstance,colorIndex){
    openNote(noteInstance,colorIndex);
}



function initializeEditor(id){
    
    ClassicEditor
    .create( document.querySelector( id ), {
        removePlugins: ['ImageUpload', 'EasyImage', 'Table', 'MediaEmbed' ],
    } )
    .then(
        newEditor => {
            editor = newEditor;
        }
    )
    .catch( error => {
        console.log( error );
    } );
     
}

//opening a note with its details, update local storage on save, delete from local storage on delete.
function openNote(noteInstance,colorIndex){
    //hide the background
    document.getElementById("mainPanel").style.display = "none";
    //create card container  
    let openNoteCard = document.createElement("div");
    openNoteCard.setAttribute('class', 'newNoteContainer' );
    openNoteCard.setAttribute('id','openNoteCardID');
    document.body.appendChild(openNoteCard);
    let openNoteCardHeader = openCardHeader(noteInstance,colorIndex);
    let openNoteCardBody = openCardBody(noteInstance,colorIndex);
    openNoteCard.appendChild(openNoteCardHeader);
    openNoteCard.appendChild(openNoteCardBody);
    initializeEditor("#openNoteCardUpdatedText");
}

function openCardHeader(noteInstance,colorIndex){
    let openNoteCardHeader = document.createElement("div");
    openNoteCardHeader.setAttribute('class', 'newNoteHeader' );
    openNoteCardHeader.style.borderBottomColor = colorBottomBorders[colorIndex];
    let openNoteCardTitle = openCardTitle(noteInstance);
    let openNoteCardButtons= openButtonPanel(noteInstance);
    openNoteCardHeader.appendChild(openNoteCardTitle);
    openNoteCardHeader.appendChild(openNoteCardButtons);
    return openNoteCardHeader;
}

function openCardTitle(noteInstance){
    let openNoteCardTitle = document.createElement("div");
    openNoteCardTitle.setAttribute('class', 'newNoteTitle' );
    let openNoteCardTitleText = document.createElement("input");
    openNoteCardTitleText.setAttribute("type", "text");
    openNoteCardTitleText.setAttribute("id", "openNoteUpdatedTitle");
    openNoteCardTitleText.setAttribute('class', 'newNoteTitleText' );
    openNoteCardTitleText.value = noteInstance.title;
    openNoteCardTitle.appendChild(openNoteCardTitleText);
    return openNoteCardTitle;
}

function openButtonPanel(noteInstance){
    openNoteCardButtons = document.createElement("div");
    openNoteCardButtons.setAttribute('class', 'OpenNoteCardOptions' );
    let openNoteCardSave = createSaveIconForOpenCard(noteInstance);
    let openNoteCardDelete = createDeleteIconForOpenCard(noteInstance);
    let openNoteCardClose = createCloseIconForOpenCard();
    openNoteCardButtons.appendChild(openNoteCardSave);
    openNoteCardButtons.appendChild(openNoteCardDelete);
    openNoteCardButtons.appendChild(openNoteCardClose);
    return openNoteCardButtons;
}

function createSaveIconForOpenCard(noteInstance){
    let openNoteCardSave = document.createElement("div");
    openNoteCardSave.setAttribute('class','saveNewNote');
    openNoteCardSave.setAttribute('class','tooltip');
    let saveIcon = document.createElement("i");
    saveIcon.setAttribute('class', 'material-icons' );
    saveIcon.innerHTML = "done_all";
    openNoteCardSave.appendChild(saveIcon);
    let tooltip = createTooltipText("Save");
    openNoteCardSave.appendChild(tooltip);
    openNoteCardSave.addEventListener('click', function(){
        let save_note = 1;
        let delete_note = 0;
        displayPopUp(save_note,delete_note,noteInstance);
    });
    return openNoteCardSave;
}

function updateNoteOnSave(id){ 
    let list = JSON.parse(localDataStorage.getItem('notesList')||'[]');
    let notesList = [];
    for(item in list){          
       if(id!=list[item]['id']){
            notesList.push(list[item]);
       }
       else{
           list[item]['title'] = document.getElementById("openNoteUpdatedTitle").value;
           list[item]['note'] = editor.getData();
           list[item]['modifiedTime'] =Date.now();
           notesList.push(list[item]);
       }            
    }
    localDataStorage.setItem("notesList", JSON.stringify(notesList));
    return true;    
}



function createDeleteIconForOpenCard(noteInstance){  
     let openNoteCardDelete = document.createElement("div");
     openNoteCardDelete.setAttribute('class','deleteNote');
     openNoteCardDelete.setAttribute('class','tooltip');
     let deleteIcon = document.createElement("i");
     deleteIcon.setAttribute('class', 'material-icons' );
     deleteIcon.innerHTML = "delete";
     openNoteCardDelete.appendChild(deleteIcon);
     let tooltip = createTooltipText("Delete");
     openNoteCardDelete.appendChild(tooltip);
     openNoteCardDelete.addEventListener('click', function(){
        let save_note=0;
        let delete_note=1;
        displayPopUp(save_note,delete_note,noteInstance);
    });
    return openNoteCardDelete;
}

function createCloseIconForOpenCard(){
    let close_OpenNoteCard = document.createElement("div");
    close_OpenNoteCard.setAttribute('class','closeNote');
    close_OpenNoteCard.setAttribute('class','tooltip');
    let closeIcon = document.createElement("i");
    closeIcon.setAttribute('class', 'material-icons' );
    closeIcon.innerHTML = "close";
    close_OpenNoteCard.appendChild(closeIcon);
    let tooltip = createTooltipText("Close");
    close_OpenNoteCard.appendChild(tooltip);
     close_OpenNoteCard.addEventListener('click', function(){
        closeNote();
    });
    return close_OpenNoteCard;
}

function closeNote(){
    location.reload();
}

function openCardBody(noteInstance,colorIndex){
    let openNoteCardBody = document.createElement("div");
    openNoteCardBody.setAttribute('class', 'newNoteBody' );
    let openNoteCardTextArea = openTextArea(noteInstance,colorIndex);
    openNoteCardBody.append(openNoteCardTextArea);
    return openNoteCardBody;
}

function openTextArea(noteInstance,colorIndex){
    openNoteCardTextArea = document.createElement("textarea");
    openNoteCardTextArea.setAttribute('class','newNoteBodyTextArea');
    openNoteCardTextArea.setAttribute('id','openNoteCardUpdatedText')
    openNoteCardTextArea.style.backgroundColor = colors[colorIndex];
    openNoteCardTextArea.value = noteInstance.note; 
    return openNoteCardTextArea;
}


function displayPopUp(save_note,delete_note,noteInstance){
    //blur the background.
    handleBackground("0.5","none");
    let pop_up = createPopUp(save_note,delete_note,noteInstance);
    document.body.appendChild(pop_up);
}

function handleBackground(opacity,pointerEvents){
    let mainPanel = document.getElementById("mainPanel");
    if(mainPanel){
        mainPanel.style.opacity = opacity;
        mainPanel.style.pointerEvents = pointerEvents;
    }
    let openNoteCard = document.getElementById("openNoteCardID");
    if(openNoteCard){
        openNoteCard.style.opacity = opacity;
        openNoteCard.style.pointerEvents = pointerEvents;
    }
}

function displayAppLog(log_text){
    let appLog = document.createElement("div");
    appLog.setAttribute("class","appLog");
    let appLogText = document.createElement("p");
    appLogText.setAttribute("class","appLogText");
    appLogText.innerHTML = log_text;
    appLog.appendChild(appLogText);
    document.body.appendChild(appLog);
    //close appLog
    setTimeout(function(){
        document.body.removeChild(appLog);
    },1000);
}

function deleteNote(notesId){
    list = JSON.parse(localStorage.getItem('notesList'));
    let notesList = [];
    let temp_id = -1;
    //push every note except notesID
    for (let item in list) {
        temp_id = parseInt(list[item]["id"] );
        if( temp_id != notesId ){
            notesList.push(list[item]);
        }
    }
    localDataStorage.setItem("notesList", JSON.stringify(notesList));
    return true;
}


//adding new note -> generate a template, add data in local storage when saved.
function addNote(){
    createNewNoteCard();
}


function createNewNoteCard(){
    //remove main page.
    document.getElementById("mainPanel").style.display = "none";
    //create card container  
    let noteCard = document.createElement("div");
    noteCard.setAttribute('class', 'newNoteContainer' );
    noteCard.setAttribute('id','CreatedNewNoteCard');
    let noteCardHeader = createCardHeader();
    let noteCardBody = createCardBody();
    noteCard.appendChild(noteCardHeader);
    noteCard.appendChild(noteCardBody);
    document.body.appendChild(noteCard);
    initializeEditor("#noteCardBodyText");
}

function createCardHeader(){
    let noteCardHeader = document.createElement("div");
    noteCardHeader.setAttribute('class', 'newNoteHeader' );
    let noteCardTitle = createCardTitle();
    let noteCardSave = createSaveIcon();
    noteCardHeader.appendChild(noteCardTitle);
    noteCardHeader.appendChild(noteCardSave);
    return noteCardHeader;
}

function createCardTitle(){
    let noteCardTitle = document.createElement("div");
    noteCardTitle.setAttribute('class', 'newNoteTitle' );
    let noteCardTitleText = document.createElement("input");
    noteCardTitleText.setAttribute("type", "text");
    noteCardTitleText.setAttribute("id", "noteTitle");
    noteCardTitleText.setAttribute('class', 'newNoteTitleText' );
    noteCardTitleText.placeholder = "Untitled";
    noteCardTitle.appendChild(noteCardTitleText);
    return noteCardTitle;
}

function createSaveIcon(){   
    let noteCardSave = document.createElement("div");
    noteCardSave.setAttribute('class', 'saveNewNote' );
    noteCardSave.setAttribute('class', 'tooltip' );
    let saveIcon = document.createElement("i");
    saveIcon.setAttribute('class', 'material-icons' );
    saveIcon.innerHTML = "done_all";
    noteCardSave.appendChild(saveIcon);
    let tooltip_text = createTooltipText('Save');
    noteCardSave.appendChild(tooltip_text);
    noteCardSave.addEventListener('click', function(){
        saveNewNote(event);
    });
    return noteCardSave;
}

function saveNewNote(event){
    let list = JSON.parse(localDataStorage.getItem('notesList')||'[]');
    let title = document.getElementById("noteTitle").value;
    let note = editor.getData();
    if(note=="" || title==""){
        displayAppLog("please enter valid title/note...");
        return;
    }  
    let modifiedTime = Date.now();
    let counterID = 0;
    if(list==null || list.length==0){
        counterID = 1;
        localDataStorage.setItem('counter',counterID);
    }
    else{
        counterID = parseInt(localDataStorage.getItem('counter'));
        counterID = counterID+1;
        localDataStorage.setItem('counter',counterID);
    }
    noteInstance = new NoteWrapper(counterID , title, note, modifiedTime);
    let notesList = [];
    notesList.push(noteInstance);
    notesList = notesList.concat(list);
    localDataStorage.setItem("notesList", JSON.stringify(notesList));
    displayAppLog("saving note...");
    setTimeout(function(){
        closeNote();
    },1000);
    return;
    
}

function createCardBody(){
    let noteCardBody = document.createElement("div");
    noteCardBody.setAttribute('class', 'newNoteBody' );
    let noteCardTextArea = createTextArea();
    noteCardBody.append(noteCardTextArea);
    return noteCardBody;
}

function createTextArea(){
    let noteCardTextArea = document.createElement("textarea");
    noteCardTextArea.setAttribute('class','newNoteBodyTextArea');
    noteCardTextArea.setAttribute('id','noteCardBodyText');
    noteCardTextArea.placeholder = "type something...";
    return noteCardTextArea;
}

function createPopUp(save_note,delete_note,noteInstance){
    let pop_up =  document.createElement("div");
    pop_up.setAttribute("class","popup");
    pop_up.setAttribute("id","popupID");
    let pop_up_header = createPopUpHeader(save_note,delete_note,noteInstance);
    let pop_up_options = createPopUpOptions(save_note,delete_note,noteInstance);
    pop_up.appendChild(pop_up_header);
    pop_up.appendChild(pop_up_options);
    return pop_up;
}

function createPopUpHeader(save_note,delete_note,noteInstance){
    let pop_up_header = document.createElement("div");
    pop_up_header.setAttribute("class","popUpHeader");
    let pop_up_text = document.createElement("h3");
    pop_up_text.setAttribute("class","popUpHeaderText"); 
    if(save_note==1 && delete_note==0){
        pop_up_text.innerHTML = "Save Note?"
    }
    if(delete_note==1 && save_note==0){
        pop_up_text.innerHTML = "Delete Note?"
    }
    pop_up_header.appendChild(pop_up_text);
    return pop_up_header;
}

function createPopUpOptions(save_note,delete_note,noteInstance){
   
    let pop_up_options = document.createElement("div");
    pop_up_options.setAttribute("class","popUpOptions");
    let pop_up_yes = document.createElement("button");
    pop_up_yes.addEventListener('click', function(){
        //remove popup.
        document.body.removeChild(document.getElementById("popupID"));
        if(save_note==1  && delete_note==0){
            let success = false;
            //update_note
            success = updateNoteOnSave(
                noteInstance.id,
                noteInstance.title,
                noteInstance.note,
                noteInstance.modifiedTime);
            //show_log  
            if(success){
                displayAppLog("saving note...");
            }  
        }
        if(delete_note==1 && save_note==0){
            let success = false;
            //delete_note
            success = deleteNote(noteInstance.id);
            //show_log
            if(success){
                displayAppLog("deleting note...");
            }
        }
        //close note.
        setTimeout(() => {
            closeNote();
        }, 1000);
        //un-blurr the background.
        handleBackground("1","auto");
    });
    pop_up_yes.innerHTML = "Yes";
    pop_up_yes.setAttribute("class","popUpOptionYes");
    let pop_up_no = document.createElement("button");
    pop_up_no.innerHTML = "No";
    pop_up_no.setAttribute("class","popUpOptionNo");
    pop_up_no.addEventListener('click', function(){
    //remove popup.
    document.body.removeChild(document.getElementById("popupID"));
    //un-blurr the background.
    handleBackground("1","auto");

    });
    pop_up_options.appendChild(pop_up_yes);
    pop_up_options.appendChild(pop_up_no);
    return pop_up_options;
}

function createTooltipText(tooltip_text){
    const tooltip = document.createElement("span");
    tooltip.setAttribute("class","tooltiptext");
    tooltip.innerHTML = tooltip_text;
    return tooltip;
}