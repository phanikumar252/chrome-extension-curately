  let listOfUrlJson = [];
  let taskToCreate = 0;   
  let messageToSend = ''; 
  
  var loaderInnerHtml=`<svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="25" height="25" viewBox="0 0 128 128" xml:space="preserve"><g><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#000"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#e1e1e1" transform="rotate(45 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#e1e1e1" transform="rotate(90 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#e1e1e1" transform="rotate(135 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#bebebe" transform="rotate(180 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#979797" transform="rotate(225 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#6e6e6e" transform="rotate(270 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#3c3c3c" transform="rotate(315 64 64)"/><animateTransform attributeName="transform" type="rotate" values="0 64 64;45 64 64;90 64 64;135 64 64;180 64 64;225 64 64;270 64 64;315 64 64" calcMode="discrete" dur="720ms" repeatCount="indefinite"/></g><g><circle fill="#000" cx="63.66" cy="63.16" r="12"/><animate attributeName="opacity" dur="720ms" begin="0s" repeatCount="indefinite" keyTimes="0;0.5;1" values="1;0;1"/></g></svg>`
  var errorIcon =`<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1.5-5.009c0-.867.659-1.491 1.491-1.491.85 0 1.509.624 1.509 1.491 0 .867-.659 1.509-1.509 1.509-.832 0-1.491-.642-1.491-1.509zM11.172 6a.5.5 0 0 0-.499.522l.306 7a.5.5 0 0 0 .5.478h1.043a.5.5 0 0 0 .5-.478l.305-7a.5.5 0 0 0-.5-.522h-1.655z" fill="red"/></svg>`
  var stopeIcon =`<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-sign-stop" viewBox="0 0 16 16"><path d="M3.16 10.08c-.931 0-1.447-.493-1.494-1.132h.653c.065.346.396.583.891.583.524 0 .83-.246.83-.62 0-.303-.203-.467-.637-.572l-.656-.164c-.61-.147-.978-.51-.978-1.078 0-.706.597-1.184 1.444-1.184.853 0 1.386.475 1.436 1.087h-.645c-.064-.32-.352-.542-.797-.542-.472 0-.77.246-.77.6 0 .261.196.437.553.522l.654.161c.673.164 1.06.487 1.06 1.11 0 .736-.574 1.228-1.544 1.228Zm3.427-3.51V10h-.665V6.57H4.753V6h3.006v.568H6.587Z"/><path fill-rule="evenodd" d="M11.045 7.73v.544c0 1.131-.636 1.805-1.661 1.805-1.026 0-1.664-.674-1.664-1.805V7.73c0-1.136.638-1.807 1.664-1.807s1.66.674 1.66 1.807Zm-.674.547v-.553c0-.827-.422-1.234-.987-1.234-.572 0-.99.407-.99 1.234v.553c0 .83.418 1.237.99 1.237.565 0 .987-.408.987-1.237m1.15-2.276h1.535c.82 0 1.316.55 1.316 1.292 0 .747-.501 1.289-1.321 1.289h-.865V10h-.665zm1.436 2.036c.463 0 .735-.272.735-.744s-.272-.741-.735-.741h-.774v1.485z"/><path fill-rule="evenodd" d="M4.893 0a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146A.5.5 0 0 0 11.107 0zM1 5.1 5.1 1h5.8L15 5.1v5.8L10.9 15H5.1L1 10.9z"/></svg>`;
  var successIcon =`<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" viewBox="0 0 50 50" xml:space="preserve"><circle style="fill:#25AE88;" cx="25" cy="25" r="25"/><polyline style="fill:none;stroke:#FFFFFF;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" points="  38,15 22,33 12,25 "/></svg>`
  let innerHtmlOfPopup = 
    `
    <div id="processing_popup" style="display: none;box-shadow: 3px 5px 25px -2px;position: fixed;width: 300px;background: white;bottom: 0;left: 0;padding: 10px;z-index: 9999999999999999999;height: 280px;border-radius: 10px;">
      <div style="display: flex;justify-content: space-between;">
        <div style="font-size: 16px;font-weight: 700;cursor: n-resize;">Processing...</div>
        <div style="display: flex;justify-content: center;align-items: center;">
          <svg style="cursor: pointer;display:none;" id="play_processing" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="green" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
          </svg>
          <svg style="cursor: pointer;" id="pause_processing" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-pause-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5"/>
          </svg>
          <svg style="cursor: no-resize;display:none;" id="done_processing" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="green" class="bi bi-check-all" viewBox="0 0 16 16">
            <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486z"/>
          </svg>
          <svg style="cursor: no-resize;display:none;" id="loader_processing" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="20" height="20" viewBox="0 0 128 128" xml:space="preserve">
            <g>
              <path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#000"/>
              <path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#e1e1e1" transform="rotate(45 64 64)"/>
              <path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#e1e1e1" transform="rotate(90 64 64)"/>
              <path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#e1e1e1" transform="rotate(135 64 64)"/>
              <path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#bebebe" transform="rotate(180 64 64)"/>
              <path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#979797" transform="rotate(225 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#6e6e6e" transform="rotate(270 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#3c3c3c" transform="rotate(315 64 64)"/>
              <animateTransform attributeName="transform" type="rotate" values="0 64 64;45 64 64;90 64 64;135 64 64;180 64 64;225 64 64;270 64 64;315 64 64" calcMode="discrete" dur="720ms" repeatCount="indefinite"/>
            </g>
            <g>
              <circle fill="#000" cx="63.66" cy="63.16" r="12"/><animate attributeName="opacity" dur="720ms" begin="0s" repeatCount="indefinite" keyTimes="0;0.5;1" values="1;0;1"/>
            </g>
          </svg>
        </div> 
        <div id="close_processing_popup" style="font-size: 20px;font-weight: 700;cursor: pointer;float: right;margin-right: 5px;">X</div>
      </div>
      <div style="margin-top: 10px;">
        <ul style="max-height: 225px;overflow: auto;padding: 10px;" id="progress_list"></ul>
      </div>
    </div>

    <div id="alert_popup" style="display: none;box-shadow: 3px 5px 25px -2px;position: fixed;transform: translate(50%, 50%);width: 300px;background: white;top: -4%;left: 32%;padding: 10px;z-index: 9999999999999999999;height: 400px;border-radius: 10px;">
        <div style="text-align: center;margin-top: 30px;">
            <img src="`+chrome.runtime.getURL("alert.png")+`" style="width: 40%;height: 40%;">
        </div>
        <h3 style="text-align: center;">
            One Last Things!
          </h3>
        <div style="text-align: center;margin-top: 20px;">
            While we're executing your linkedIn tasks,<b>Please do not leave this tab.</b> Leaving the tab will loose this process.
        </div>
        <div style="text-align: center;margin-top: 20px;">
            <button id="alert_close" style="padding: 10px;background: #ec3636;border-radius: 10px;color: white;min-width: 70px;cursor: pointer;">cancel</button>
            <button id="alert_start" style="padding: 10px;background: #05a705;border-radius: 10px;color: white;cursor: pointer;min-width: 70px;">Start</button>
        </div>
    </div>

    <div id="info_popup" style="display: none;box-shadow: 3px 5px 25px -2px;position: fixed;transform: translate(50%, 50%);width: 300px;background: white;top: -4%;left: 32%;padding: 10px;z-index: 9999999999999999999;height: 400px;border-radius: 10px;">
        <div style="text-align: center;margin-top: 30px;">
            <img src="`+chrome.runtime.getURL("alert.png")+`" style="width: 40%;height: 40%;">
        </div>
        <h3 style="text-align: center;">
            One Last Things!
          </h3>
        <div style="text-align: center;margin-top: 20px;">
            While we're executing your linkedIn tasks,<b>Please do not leave this tab.</b> Leaving the tab will loose this process.
        </div>
        <div style="text-align: center;margin-top: 20px;">
            <button id="info_close" style="padding: 10px;background: #ec3636;border-radius: 10px;color: white;min-width: 70px;cursor: pointer;">cancel</button>
            <button id="info_start" style="padding: 10px;background: #05a705;border-radius: 10px;color: white;cursor: pointer;min-width: 70px;">Start</button>
        </div>
    </div>

    <iframe style="display: none;position: fixed;top: 0;left: 0;z-index: 999999999;width: 100%;height: 100%;" id="linkedInIframe"></iframe>
    <div class="curately-modal" id="modal">
        <div class="curately-modal-wrap">
            <div style="padding: 15px">
              <h3>Create Task</h3>
              <div>
                <label for="title">Add Prospects Profile Urls</label>
                <textarea id="urlInput" style="outline:none;" rows="10" id="messageInput" placeholder="https://www.linkedin.com/in/parthsolanki049/"></textarea>
                <div style="display: flex;justify-content: end;margin-top: 30px;">
                  <button id="createTask" style="padding: 10px;border-radius: 10px;color: white;background: #17ba17;font-size: 16px;">Create</button>
                </div>
              </div>
            </div>
        </div>
    </div>`;  
    

  var section = document.createElement("div");
  section.setAttribute('class','curately-section l-full-height');
  section.innerHTML = innerHtmlOfPopup;
  document.body.appendChild(section);

  document.getElementById('play_processing').addEventListener('click',()=>{
    document.getElementById('pause_processing').style.display = 'block';
    document.getElementById('play_processing').style.display = 'none';
    chrome.storage.sync.set({'runningTask':true}).then(()=>{});
    letsAutomationStartProcess(listOfUrlJson,taskToCreate,messageToSend,true);
  });
  
  document.getElementById('pause_processing').addEventListener('click',()=>{
    document.getElementById('pause_processing').style.display = 'none';
    document.getElementById('loader_processing').style.display = 'block';
    chrome.storage.sync.set({'runningTask':false}).then(()=>{});
  });

  const addUriModal = document.getElementById('modal');
  
  addUriModal.addEventListener('click', (e) => {
      if (e.target === addUriModal) {
          addUriModal.classList.remove('active');
      }
  });

  const process_popup = document.getElementById('processing_popup');

  let close_processing_popup = document.getElementById('close_processing_popup');
  close_processing_popup.addEventListener('click',()=>{
    process_popup.style.display='none';    
  })

  const alert_popup = document.getElementById('alert_popup');
  const alert_start = document.getElementById('alert_start');
  const alert_close = document.getElementById('alert_close');

  const createTask = document.getElementById('createTask');
  const urlInput = document.getElementById('urlInput');
  createTask.addEventListener('click', async() => {
    let runningTask = await chrome.storage.sync.get(['runningTask']);
    // if(!runningTask['runningTask']){
      await chrome.storage.sync.set({ 'runningTaskData': [] });      
      
      let URIS_1 = await getSplitedUrlsArry(urlInput);

      if (URIS_1.length > 0) {
        alert_popup.style.display='block';    
        addUriModal.classList.remove('active');    
      }

      alert_close.addEventListener('click',()=>{
        alert_popup.style.display='none';
        addUriModal.classList.add('active');
      })
    
      alert_start.addEventListener('click',async()=>{

        let progressList = document.getElementById("progress_list");
        while (progressList.firstChild) {
          progressList.removeChild(progressList.firstChild);
        }

        let URIS_2 = await getSplitedUrlsArry(urlInput);

        if (URIS_2.length > 0) {
          alert_popup.style.display='block';    
          addUriModal.classList.remove('active');    
        }

        alert_popup.style.display='none';
        process_popup.style.display='block';
        document.querySelector('[id="searchListPopupDivClass"]').style.display = 'none';        
        await chrome.storage.sync.set({ 'runningTask': true });
        await chrome.storage.sync.set({ 'runningTaskData': URIS_2 });
        startTask(URIS_2);
      })

    // }
  })

  const getSplitedUrlsArry = (urlInput) => {
    return new Promise((resolve, reject) => {
      let urls = [];
      urls = urlInput.value.split('https:');

      let jsonOfUrls = [];

      urls.forEach(url => {
        if(url.trim()!=''){
          let details = {
            src: 'https:'+url.trim(),
            hasError: false,
            error: '',
            isInvited: false
          };
          jsonOfUrls.push(details);
        }
      });

      resolve(jsonOfUrls);
    })
  }
  
  const startTask = async (listOfUrls=[])=>{
    try{
      let isAvailable = await checkTabAvailability();
      if(isAvailable){
        document.getElementById('linkedInIframe').style.display = 'block';
        for (let index = 0; index < listOfUrls.length; index++) {
          chrome.storage.sync.set({'run':listOfUrls[index].src});
          let iframe = document.getElementById('linkedInIframe');  
          iframe.src=listOfUrls[index].src;
          await delay(8000);
          if((iframe.contentDocument.location.href.includes('linkedin.com') && !iframe.contentDocument.location.href.includes('404'))){
            let iframeContent = iframe.contentWindow.document;
            if(iframeContent.querySelectorAll('main button.pvs-profile-actions__action').length>0){
              iframeContent.querySelector('main button.pvs-profile-actions__action').click();
              await delay(8000);
              if(iframeContent.querySelector('[data-test-modal].send-invite')!=null){
                iframeContent.querySelector('[data-test-modal].send-invite .artdeco-modal__actionbar [aria-label="Send without a note"]').click();
                await delay(2000);
                listOfUrls[index].hasError = false;
                listOfUrls[index].error = '';
                listOfUrls[index].isInvited = true;
                await delay(1000);
                updateProgressList(listOfUrls)
                continue;
              }else{
                listOfUrls[index].hasError = true;
                listOfUrls[index].error = 'Already Invited';
                updateProgressList(listOfUrls)
                continue;
              }
            }else{
              listOfUrls[index].hasError = true;
              listOfUrls[index].error = 'Already In Your Connection';
              updateProgressList(listOfUrls)
              continue;
            }
          }else{
            listOfUrls[index].hasError = true;
            listOfUrls[index].error = 'Invalid Url';
            updateProgressList(listOfUrls)
            continue;
          }
        }
      }
    }finally{
      document.getElementById('linkedInIframe').style.display = 'none';
      chrome.storage.sync.set({'runningTask':false});
      chrome.storage.sync.set({'run':''});
      document.querySelector('[id="searchListPopupDivClass"]').style.display = 'block';      
    }
  }

  const checkTabAvailability = async () => {
    return new Promise((resolve, reject) => {
        resolve(document.getElementById('linkedInIframe')!=null);   
    })
  }

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }


const updateProgressList = async (newValue)=>{
  if(newValue.length>0){
    listOfUrlJson = newValue;
    const container = document.getElementById('progress_list');
    let {runningTask:isRunning} = await chrome.storage.sync.get(['runningTask']);
    for (let index = 0; index < newValue.length; index++) {

        if(container.querySelector(`[id="${newValue[index].src}loader"]`)!=null){
          if(newValue[index].hasError){
            container.querySelector(`[id="${newValue[index].src}loader"]`).innerHTML = errorIcon;
            container.querySelector(`[id="${newValue[index].src}error"]`).textContent = newValue[index].error;
          }else if(newValue[index].isInvited){
            container.querySelector(`[id="${newValue[index].src}loader"]`).innerHTML = successIcon;
          }else if(!newValue[index].isDone && !isRunning){
            container.querySelector(`[id="${newValue[index].src}loader"]`).innerHTML = stopeIcon;
            container.querySelector(`[id="${newValue[index].src}error"]`).textContent = "stopped";
          }
          continue;
        }

        const listItem = document.createElement('li');
        listItem.style.marginTop = '15px';
        listItem.style.marginBottom = '15px';

        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'space-between';

        const startErrorDiv = document.createElement('div');
        startErrorDiv.id=newValue[index].src+'error';
        startErrorDiv.setAttribute('style','width: 100%;white-space: nowrap;overflow: hidden;margin-left: 5px;text-overflow: ellipsis;color: red;')

        const nameDiv = document.createElement('sub');
        nameDiv.id=newValue[index].src+'name';
        nameDiv.setAttribute('style','position: absolute;width: 100%;white-space: nowrap;margin-left: 5px;text-overflow: ellipsis;z-index: 99999999999999;')
        
        const nameTextBTag = document.createElement('b');
        nameTextBTag.textContent = newValue[index].name;
        nameDiv.appendChild(nameTextBTag);

        const startDiv = document.createElement('div');
        startDiv.setAttribute('style','width: 90%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;padding: 5px;');
        startDiv.textContent = newValue[index].src.replace('https://www.linkedin.com/in/','').split('?')[0];
        
        const startParentDiv = document.createElement('div');
        startParentDiv.style.maxWidth = '75%';
        startParentDiv.style.position = 'relative';
        startParentDiv.appendChild(startDiv);
        startParentDiv.appendChild(nameDiv);
        startParentDiv.appendChild(startErrorDiv);
        
        const loaderDiv = document.createElement('div');
        loaderDiv.id=newValue[index].src+'loader';
        loaderDiv.innerHTML = loaderInnerHtml;

        div.appendChild(startParentDiv);
        div.appendChild(loaderDiv);
        listItem.appendChild(div);
        container.appendChild(listItem);
    }
  }
}


const addSendConnectionUriIntoLocalStorage = (connection) => {
  return new Promise(async(resolve, reject) => {
    try {
      let { listOfConnectionSended } = await chrome.storage.sync.get(['listOfConnectionSended']);
      listOfConnectionSended = listOfConnectionSended || [];
      listOfConnectionSended.push(connection);
      await chrome.storage.sync.set({ listOfConnectionSended });
      resolve(true);
    } catch (error) {
      resolve(false);
    }
  })
};

 

const sendConnection_process = async (listOfUrls=[],message='')=>{
  try{
    let isAvailable = await checkTabAvailability();
    if(isAvailable){
      document.getElementById('linkedInIframe').style.display = 'block';
      for (let index = 0; index < listOfUrls.length; index++) {
        if(listOfUrls[index].isDone){
          updateProgressList(listOfUrls);
          continue;
        }
        let isRunning = await checkItsRunningOrNot();
        if(!isRunning){
          document.getElementById('play_processing').style.display = 'block';
          document.getElementById('loader_processing').style.display = 'none';
          break;
        }
        chrome.storage.sync.set({'run':listOfUrls[index].src});
        let iframe = document.getElementById('linkedInIframe');  
        iframe.src=listOfUrls[index].src;
        await delay(2000);
        await checkAllElementLoaded();
        if((iframe.contentDocument.location.href.includes('linkedin.com') && !iframe.contentDocument.location.href.includes('404'))){
          let iframeContent = iframe.contentWindow.document;
          if(iframeContent.querySelectorAll('main [data-test-icon="connect-small"]').length>0){
            iframeContent.querySelectorAll('main [data-test-icon="connect-small"]')[0].parentElement.click()
            await delay(1000);
            if(message=='' || message==null){
              if(iframeContent.querySelector('[data-test-modal].send-invite')!=null){
                iframeContent.querySelector('[data-test-modal].send-invite .artdeco-modal__actionbar [aria-label="Send without a note"]').click();
                await delay(2000);
                if(iframeContent.querySelectorAll('[aria-labelledby="ip-fuse-limit-alert__header"]').length>0){
                  listOfUrls[index].hasError = true;
                  listOfUrls[index].isDone=true;
                  listOfUrls[index].error = iframeContent.querySelectorAll('[aria-labelledby="ip-fuse-limit-alert__header"] .ip-fuse-limit-alert__header')[0].textContent.trim();
                  listOfUrls[index].isInvited = false;
                  updateProgressList(listOfUrls)
                  continue;
                }
                listOfUrls[index].hasError = false;
                listOfUrls[index].error = '';
                listOfUrls[index].isDone=true;
                listOfUrls[index].isInvited = true;
                await addSendConnectionUriIntoLocalStorage(listOfUrls[index]);
                await delay(1000);
                updateProgressList(listOfUrls)
                continue;
              }else{
                listOfUrls[index].hasError = false;
                listOfUrls[index].error = '';
                listOfUrls[index].isDone=true;
                listOfUrls[index].isInvited = true;
                await addSendConnectionUriIntoLocalStorage(listOfUrls[index]);
                updateProgressList(listOfUrls)
                continue;
              }
            }else if(message!='' && message!=null){
              if(iframeContent.querySelector('[data-test-modal].send-invite')!=null){
                if(iframeContent.querySelectorAll('[data-test-modal-id="send-invite-modal"] .artdeco-button.artdeco-button--muted.artdeco-button--2.artdeco-button--secondary').length>0)
                  iframeContent.querySelectorAll('[data-test-modal-id="send-invite-modal"] .artdeco-button.artdeco-button--muted.artdeco-button--2.artdeco-button--secondary')[0].click()
                  await delay(2000);
                  if(iframeContent.querySelectorAll('[data-test-modal-id="send-invite-modal"] [id="custom-message"]').length>0){
                    let inputElement = iframeContent.querySelector('[data-test-modal-id="send-invite-modal"] .send-invite').querySelector('[name="message"]');
                    inputElement.value = message;
                    let event = new Event('input', {
                        bubbles: true,
                        cancelable: true,
                    });
                    inputElement.dispatchEvent(event);
                    await delay(1000);
                    if(iframeContent.querySelectorAll('[data-test-modal-id="send-invite-modal"] .artdeco-modal__actionbar .artdeco-button.artdeco-button--2.artdeco-button--primary').length>0){
                      iframeContent.querySelectorAll('[data-test-modal-id="send-invite-modal"] .artdeco-modal__actionbar .artdeco-button.artdeco-button--2.artdeco-button--primary')[0]?.click()
                      await delay(1000);
                    }

                    if(iframeContent.querySelectorAll('[aria-labelledby="ip-fuse-limit-alert__header"]').length>0){
                      listOfUrls[index].hasError = true;
                      listOfUrls[index].isDone=true;
                      listOfUrls[index].error = iframeContent.querySelectorAll('[aria-labelledby="ip-fuse-limit-alert__header"] .ip-fuse-limit-alert__header')[0].textContent.trim();
                      listOfUrls[index].isInvited = false;
                      updateProgressList(listOfUrls)
                      continue;
                    }

                  }else if(iframeContent.querySelectorAll('[data-test-modal-id="modal-upsell"] [id="modal-upsell-header"]').length>0){
                    listOfUrls[index].hasError = true;
                    listOfUrls[index].isDone=true;
                    listOfUrls[index].error = iframeContent.querySelectorAll('[data-test-modal-id="modal-upsell"] [id="modal-upsell-header"]')[0].textContent.trim();
                    listOfUrls[index].isInvited = false;
                    updateProgressList(listOfUrls)
                    continue;
                  }
                  listOfUrls[index].hasError = false;
                  listOfUrls[index].error = '';
                  listOfUrls[index].isDone=true;
                  listOfUrls[index].isInvited = true;
                  await addSendConnectionUriIntoLocalStorage(listOfUrls[index]);
                  await delay(1000);
                  updateProgressList(listOfUrls)
                  continue;
              }else{
                listOfUrls[index].hasError = false;
                listOfUrls[index].error = '';
                listOfUrls[index].isDone=true;
                listOfUrls[index].isInvited = true;
                await addSendConnectionUriIntoLocalStorage(listOfUrls[index]);
                updateProgressList(listOfUrls)
                continue;
              } 
              
            }
          }else if(iframeContent.querySelectorAll('.top-card-background-hero-image')[0]?.parentElement?.querySelectorAll('main .artdeco-card [data-test-icon="add-small"]')?.length>0){
            await delay(500);
            iframeContent.querySelectorAll('.top-card-background-hero-image')[0]?.parentElement?.querySelectorAll('main .artdeco-card [data-test-icon="add-small"]')[0]?.parentElement?.click();
            await delay(1000);
            
            listOfUrls[index].hasError = false;
            listOfUrls[index].error = '';
            listOfUrls[index].isDone=true;
            listOfUrls[index].isInvited = true;
            await addSendConnectionUriIntoLocalStorage(listOfUrls[index]);
            updateProgressList(listOfUrls)
            continue;
          }else{
            listOfUrls[index].hasError = true;
            listOfUrls[index].error = iframeContent.querySelectorAll('main [data-test-icon="clock-small"]').length>0?'Request already sent.':'Already in your connection';
            listOfUrls[index].isDone=true;
            listOfUrls[index].isInvited = false;
            updateProgressList(listOfUrls)
            continue;
          }
        }else{
          listOfUrls[index].hasError = true;
          listOfUrls[index].error = 'Invalid Url';
          updateProgressList(listOfUrls)
          continue;
        }        
      }
    }
  }finally{
    document.getElementById('loader_processing').style.display = 'none';
    document.getElementById('pause_processing').style.display = 'none';
    document.getElementById('play_processing').style.display = 'block';
    document.getElementById('linkedInIframe').style.display = 'none';
    chrome.storage.sync.set({'runningTask':false});
    chrome.storage.sync.set({'run':''});
    document.querySelector('[id="searchListPopupDivClass"]').style.display = 'block';      
  }
}


const checkItsRunningOrNot =()=>{
  return new Promise((resolve)=>{
    chrome.storage.sync.get(['runningTask'],(result)=>{
      resolve(result.runningTask)
    })
  })
}

const sendMessages_process = async (listOfUrls=[],message='')=>{
  try{
    let isAvailable = await checkTabAvailability();
    if(isAvailable){
      document.getElementById('linkedInIframe').style.display = 'block';
      for (let index = 0; index < listOfUrls.length; index++) {
        if(listOfUrls[index].isDone){
          updateProgressList(listOfUrls);
          continue;
        }
        let isRunning = await checkItsRunningOrNot();
        if(!isRunning){
          document.getElementById('play_processing').style.display = 'block';
          document.getElementById('loader_processing').style.display = 'none';
          break;
        }
        chrome.storage.sync.set({'run':listOfUrls[index].src});
        let iframe = document.getElementById('linkedInIframe');  
        iframe.src=listOfUrls[index].src;
        await delay(2000);
        await checkAllElementLoaded();
        if((iframe.contentDocument.location.href.includes('linkedin.com') && !iframe.contentDocument.location.href.includes('404'))){
          let iframeContent = iframe.contentWindow.document;
          await delay(2000);
          await clearOtherOpenMessagePopups_automation();
          if(iframeContent.querySelectorAll('main [aria-label^="Message"]').length>0){
            iframeContent.querySelectorAll('main [aria-label^="Message"]')[0].click()
            await delay(1000);
            if(message!='' && message!=null){
              if(iframeContent.querySelectorAll('[data-test-modal-id="modal-upsell"]').length>0){
                listOfUrls[index].hasError = true;
                listOfUrls[index].isDone=true;
                listOfUrls[index].error = "You don't have a premium account for this feature.";
                listOfUrls[index].isInvited = false;
                await delay(1000);
                updateProgressList(listOfUrls)
                continue;
              }
              if(iframeContent.querySelectorAll('[data-view-name="message-overlay-conversation-bubble-item"]').length>0){
                  await delayFor(1500);
                  await pastMessageOnLinkedPopup_automation(message,iframeContent.querySelector('[data-view-name="message-overlay-conversation-bubble-item"] [role="textbox"]'));
                  listOfUrls[index].hasError = false;
                  listOfUrls[index].error = '';
                  listOfUrls[index].isDone=true;
                  listOfUrls[index].isInvited = true;
                  await delay(1000);
                  updateProgressList(listOfUrls)
                  continue;
              }else{
                listOfUrls[index].hasError = true;
                listOfUrls[index].isDone=true;
                listOfUrls[index].error = 'Something went wrong';
                listOfUrls[index].isInvited = false;
                updateProgressList(listOfUrls)
                continue;
              }              
            }
          }else{
            listOfUrls[index].hasError = true;
            listOfUrls[index].isDone=true;
            listOfUrls[index].error = 'Something went wrong';
            listOfUrls[index].isInvited = false;
            updateProgressList(listOfUrls)
            continue;
          }
        }else{
          listOfUrls[index].hasError = true;
          listOfUrls[index].error = 'Invalid Url';
          updateProgressList(listOfUrls)
          continue;
        }
      }
    }
  }finally{
    document.getElementById('loader_processing').style.display = 'none';
    document.getElementById('pause_processing').style.display = 'none';
    document.getElementById('play_processing').style.display = 'block';
    document.getElementById('linkedInIframe').style.display = 'none';
    chrome.storage.sync.set({'runningTask':false});
    chrome.storage.sync.set({'run':''});
    document.querySelector('[id="searchListPopupDivClass"]').style.display = 'block';      
  }
}


const pastMessageOnLinkedPopup_automation=(message,i)=>{
  return new Promise(async(resolve)=>{
      if (i !== null) {
          i.focus();
          document.getElementById('linkedInIframe').contentWindow.document.execCommand('selectAll', false, null);
          await delayFor(500);
          document.getElementById('linkedInIframe').contentWindow.document.execCommand('cut', false, null);
          await delayFor(500);
          document.getElementById('linkedInIframe').contentWindow.document.execCommand('insertText', false, message);
          await delayFor(500);
      }
      if(document.getElementById('linkedInIframe').contentWindow.document.querySelector('[aria-label="Messaging"] footer.msg-form__footer button.msg-form__send-button')==null){
          document.getElementById('linkedInIframe').contentWindow.document.querySelector('[data-test-msg-ui-send-mode-toggle-presenter__button]')?.click();
          await delayFor(800);
          document.getElementById('linkedInIframe').contentWindow.document.querySelector('[data-test-msg-ui-send-mode-toggle-presenter__click-to-send-input]')?.click();
      }
      if(document.getElementById('linkedInIframe').contentWindow.document.querySelector('[aria-label="Messaging"] footer.msg-form__footer button.msg-form__send-button')==null){
        document.getElementById('linkedInIframe').contentWindow.document.querySelector('[aria-label="Messaging"] [href="#send-privately-small"]')?.parentElement?.parentElement?.click()
      }else{
        document.getElementById('linkedInIframe').contentWindow.document.querySelector('[aria-label="Messaging"] footer.msg-form__footer button.msg-form__send-button')?.click();
      }
      await delayFor(2000);
      resolve(true);
  })
}


const clearOtherOpenMessagePopups_automation= ()=>{
  return new Promise(async(resolve)=>{
      let all_popups = document.getElementById('linkedInIframe').contentWindow.document.querySelectorAll('[aria-label="Messaging"] header [href="#close-small"]');
      if(all_popups.length>0){
          for(let i=0;i<all_popups.length;i++){
              all_popups[i].parentElement.parentElement.click();
              await delayFor(1000);
          }
      }
      resolve(true);
  })
}

const letsAutomationStartProcess = (urlListObj, typeNumber = 0, message = '',byPassUrlFilter=false) => {
  return new Promise(async (resolve) => {
    taskToCreate = typeNumber;
    messageToSend = message;
    listOfUrlJson = urlListObj;

    let jsonOfUrls=[];
    if(byPassUrlFilter){
      jsonOfUrls = urlListObj;
    }else{
      jsonOfUrls = urlListObj.map(url => ({
        src: String(url.linkedin_url).split('?')[0],
        name:url.name,
        hasError: false,
        error: '',
        isInvited: false,
        isDone:false
      }));
    }

    const toggleDisplay = (id, display) =>{
      if(document.getElementById(id)!=null){
        document.getElementById(id).style.display = display;
      } 
    }
    toggleDisplay('info_popup', 'block');

    const onStart = async () => {
      toggleDisplay('processing_popup', 'block');
      toggleDisplay('info_popup', 'none');
      toggleDisplay('loader_processing','none')
      toggleDisplay('done_processing','none')
      toggleDisplay('play_processing','none');
      toggleDisplay('pause_processing','block')
    chrome.storage.sync.set({'runningTask':false}).then(()=>{});
      await chrome.storage.sync.set({ 'runningTask': true });

      const progressList = document.getElementById("progress_list");
      while (progressList.firstChild) progressList.removeChild(progressList.firstChild);
      updateProgressList(jsonOfUrls);

      typeNumber === 0 ? sendConnection_process(jsonOfUrls, message) : sendMessages_process(jsonOfUrls, message);

      removeListeners();
    };

    const onClose = () => {
      toggleDisplay('info_popup', 'none');
      toggleDisplay('play_processing','block');
      toggleDisplay('pause_processing','none')
      removeListeners();
    };

    const removeListeners = () => {
      document.getElementById('info_start').removeEventListener('click', onStart);
      document.getElementById('info_close').removeEventListener('click', onClose);
    };

    document.getElementById('info_start').addEventListener('click', onStart);
    document.getElementById('info_close').addEventListener('click', onClose);

    resolve(true);
  });
};


const checkAllElementLoaded = () => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const elements = document.getElementById('linkedInIframe').contentWindow.document.querySelectorAll('main .artdeco-dropdown__trigger.artdeco-dropdown__trigger--placement-bottom.pvs-profile-actions__action.artdeco-button.artdeco-button--secondary.artdeco-button--muted.artdeco-button--2');
      
      if (elements.length > 0) {
        clearInterval(interval); 
        resolve(elements); 
      }
    }, 200); 
  });
};


chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if(request.message=='ADD_TO_CONNECTION'){
    letsAutomationStartProcess(request.data,0,request.dm).then(()=>{});   
    sendResponse(true);    
  }

  if(request.message=='SEND_PERSONALIZED_MESSAGE'){
    letsAutomationStartProcess(request.data,1,request.dm).then(()=>{});
  }
})


setInterval(() => {
  if(listOfUrlJson!=null && listOfUrlJson.length>0 && !(listOfUrlJson.some((l) =>l.isDone==false))){
    document.getElementById('loader_processing').style.display = 'none';
    document.getElementById('pause_processing').style.display = 'none';
    document.getElementById('play_processing').style.display = 'none';
    document.getElementById('done_processing').style.display = 'block';
  } 
}, 200);
