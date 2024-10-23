// globle variables--------------------------------------------
const quill = new Quill('#editor', {
    theme: 'snow'
});

const bar = new ProgressBar.Line("#progressContainer", {
    strokeWidth: 4,
    easing: 'easeInOut',
    duration: 1400,
    color: '#146ef6',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: { width: '100%', height: '100%' }
});
var searchList = [];
var emailPhoneData = [];
var currentlyFethRecords = false;
let isSequenceModal = false;

let recrData = {
    recrId: "",
    fromName: "",
    fromEmailId: ""
}
var connect_svg =
    `<svg style="margin-right: 5px;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
</svg>`;

var message_svg =
    `<svg style="margin-right: 5px;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-dots" viewBox="0 0 16 16">
  <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
  <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
</svg>`;
// globle variables--------------------------------------------

const checkIsChecked = () => {
    // info set Request sended     
    chrome.storage.sync.get(['listOfConnectionSended']).then((result) => {
        if (result.listOfConnectionSended && result.listOfConnectionSended.length > 0) {
            for (let index = 0; index < result.listOfConnectionSended.length; index++) {
                if (document.getElementById("requestInfo_" + btoa(result.listOfConnectionSended[index].src).replace(/[^a-zA-Z]/g, '')) != null) {
                    document.getElementById("requestInfo_" + btoa(result.listOfConnectionSended[index].src).replace(/[^a-zA-Z]/g, '')).style.display = "block";
                }
            }
        }
    });

    if (searchList.length > 0 && document.querySelectorAll('[id^="CK_BOX_"]').length > 0) {
        const isAllChecked = Array.from(document.querySelectorAll('[id^="CK_BOX_"]')).every(a => a.checked);
        if (isAllChecked && !document.querySelector('[id="first_connection"]').checked && !document.querySelector('[id="second_connection"]').checked) {
            document.getElementById("select_all").checked = true;
        } else {
            document.getElementById("select_all").checked = false;
        }
    }
    const isChecked = Array.from(document.querySelectorAll('[id^="CK_BOX_"]')).some(a => a.checked);
    if (assignModal.style.display === "block") {
        document.querySelector(".bottom-done_btn").style.display = "none";
        return
    }
    if (emailModal.style.display !== "block") {
        document.querySelector(".bottom-done_btn").style.display = isChecked ? "block" : "none";
    }
    else document.querySelector(".bottom-done_btn").style.display = "none"
};

setInterval(checkIsChecked, 200);

const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// form_container
const closePopup = (close = true) => {
    var hidepopup = null;
    if (close) {
        hidepopup = () => {
            document.getElementById("searchlistPopupDivClass").style.display = "none";
        }
    } else {
        hidepopup = () => {
            document.getElementById("searchlistPopupDivClass").style.display = "block";
        }
    }
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: hidepopup,
        })
            .then(() => { });
    });
}

document.getElementById("closePopup").addEventListener("click", closePopup);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "DELETE_CHECKBOX") {
        document.getElementById("CK_BOX_" + request.data).parentElement.remove();
        sendResponse(true);
    }
    if (request.type === "LIST_OF_SEARCHES") {
        new Promise((resolve) => {
            try {
                document.getElementById('first_connection').checked = false;
                document.getElementById('second_connection').checked = false;
                document.getElementById('select_all').checked = false;
                document.querySelector('.ovrly').style.display = "flex";
                searchList = request?.data;
                closePopup(false);
                const profilesContainer = document.getElementById('list_of_search');

                profilesContainer.innerHTML = '';
                if (searchList.length == 0 || searchList == null) {
                    chrome.storage.sync.get(['actionType']).then((actionType) => {
                        if (actionType['actionType'] == 'SEND_REQUEST') {
                            document.querySelector('#connection_not_found').style.display = "block";
                        } else if (actionType['actionType'] == 'SEND_MESSAGES') {
                            document.querySelector('#message_not_found').style.display = "block";
                        }
                    });
                } else {
                    document.querySelector('#connection_not_found').style.display = "none";
                    document.querySelector('#message_not_found').style.display = "none";
                }

                getEmailPhoneData(searchList).then(() => {
                    let index = 0;
                    for (let i = 0; i < searchList?.length; i++) {
                        let profile = searchList[i];
                        console.log(profile, 'profile')
                        profile.hasMobile = false;
                        profile.hasEmail = false;
                        profile.userId = null;

                        profile.showPeopleLabel = false;
                        profile.showRocketLabel = false;
                        profile.showContactLabel = false;



                        emailPhoneData?.forEach((a) => {
                            if (profile.linkedin_url.toLowerCase().startsWith(a.linkedinUrl.toLowerCase())) {
                                if (a.userId) {
                                    profile.userId = a.userId;
                                    profile.saved = true;

                                }
                                profile.poolCount = a.poolCount;
                                profile.sequenceCount = a.sequenceCount;
                            }
                        });

                        const profileCard = document.createElement('div');
                        profileCard.className = 'profile-card';
                        profileCard.id = btoa(profile.linkedin_url).replace(/[^a-zA-Z]/g, '');

                        if (searchList.length - 1 == index) {
                            profileCard.classList.add('mb-100px');
                        }

                        const profileHeader = document.createElement('div');
                        profileHeader.className = 'profile-header';

                        const checkboxContainer = document.createElement('div');
                        checkboxContainer.style.padding = '10px';
                        checkboxContainer.style.marginLeft = '-18px';
                        checkboxContainer.style.transform = 'scale(1.7)';

                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.className = 'form-control';
                        checkbox.id = "CK_BOX_" + profile.id;
                        checkbox.setAttribute("data-url", profile.linkedin_url);
                        checkbox.setAttribute("data-userId", profile.userId ? profile.userId : 0);
                        checkboxContainer.appendChild(checkbox);

                        checkbox.addEventListener('change', () => {
                            const { first_connection_count, second_connection_count } =
                                [...document.querySelectorAll('[id^="CK_BOX_"]:checked')].reduce((acc, ck) => {
                                    const { is_first_connection } = searchList?.find(({ id }) => id === ck.id.replace('CK_BOX_', '')) || {};
                                    is_first_connection ? acc.first_connection_count++ : acc.second_connection_count++;
                                    return acc;
                                }, { first_connection_count: 0, second_connection_count: 0 });

                            if (first_connection_count >= second_connection_count) {
                                document.getElementById('actionButton').classList.remove('d-none-importent');
                                document.getElementById('actionButton').classList.add('d-flex-importent');
                                // document.getElementById('downBtn').classList.remove('d-none-importent');
                                document.getElementById('downBtn').classList.add('d-flex-importent');

                                chrome.storage.sync.set({ 'actionType': 'SEND_MESSAGES' }).then(() => { });
                                document.querySelector('#openModalBtn').textContent = 'Messages'
                                withoutMessage.style.display = 'none';
                                submitMessageBtn.textContent = 'Start Send Messages';
                                openModalBtn_svg.innerHTML = message_svg;
                            } else {
                                // document.getElementById('actionButton').classList.remove('d-none-importent');
                                document.getElementById('actionButton').classList.add('d-flex-importent');
                                // document.getElementById('downBtn').classList.remove('d-none-importent');
                                document.getElementById('downBtn').classList.add('d-flex-importent');
                                chrome.storage.sync.set({ 'actionType': 'SEND_REQUEST' }).then(() => { });
                                document.querySelector('#openModalBtn').textContent = 'Connect'
                                withoutMessage.style.display = 'block';
                                submitMessageBtn.textContent = 'With Message';
                                openModalBtn_svg.innerHTML = connect_svg;
                            }
                        });



                        const col2 = document.createElement('div');
                        col2.className = 'col-2';

                        const profileImage = document.createElement('img');
                        profileImage.src = profile.imageUri;
                        profileImage.alt = profile.name;
                        profileImage.className = 'profile-image';

                        const profileDetails = document.createElement('div');
                        profileDetails.className = 'profile-details';

                        const profileName = document.createElement('div');
                        profileName.className = 'profile-name';
                        profileName.textContent = profile.name;

                        const profileLocation = document.createElement('div');
                        profileLocation.className = 'f-12 profile-location';
                        profileLocation.textContent = profile.location;

                        const profileLink = document.createElement("a")
                        profileLink.className = 'profile-name profile-link';
                        profileLink.textContent = profile.name;
                        profileLink.setAttribute("target", "_blank");
                        profileLink.setAttribute("href", `https://appqa.curately.ai/#/qademo/candidate/view/` + profile.userId)

                        const requestInfo = document.createElement('div');
                        requestInfo.style.color = 'green';
                        requestInfo.style.display = 'none';
                        requestInfo.id = 'requestInfo_' + btoa(String(profile.linkedin_url).split('?')[0]).replace(/[^a-zA-Z]/g, '');
                        requestInfo.className = 'f-12 request-info';
                        requestInfo.textContent = "Request sent";


                        col2.appendChild(profileImage);
                        if (profile.userId) {
                            profileDetails.appendChild(profileLink);
                        }
                        else {
                            profileDetails.appendChild(profileName);
                        }
                        profileDetails.appendChild(profileLocation);
                        profileDetails.appendChild(requestInfo);

                        if (profile.allowToCheck) {
                            profileHeader.appendChild(checkboxContainer);
                        }
                        profileHeader.appendChild(col2);
                        profileHeader.appendChild(profileDetails);

                        profileCard.appendChild(profileHeader);

                        const profileJobTitle = document.createElement('div');
                        profileJobTitle.className = 'f-12 profile-job-title';
                        profileJobTitle.textContent = profile.job_title;

                        profileCard.appendChild(profileJobTitle);

                        const email_main_div = document.createElement('div');
                        const phone_main_div = document.createElement('div');
                        const labelElementPeople = document.createElement("span");
                        const labelElementRocket = document.createElement("span");
                        const labelElementContact = document.createElement("span");
                        labelElementPeople.setAttribute("title", "PeopleData");
                        labelElementRocket.setAttribute("title", "RocketReach");
                        labelElementContact.setAttribute("title", "contactOutData");

                        labelElementRocket.textContent = "R";
                        labelElementRocket.setAttribute("style", `background-color:#146ef6;color:#fff;height:25px;
                            width:25px;border-radius:50%;margin-left:10px;display:flex;justify-content:center;align-items:center;
                            `);
                        labelElementPeople.textContent = "P";
                        labelElementPeople.setAttribute("style", `background-color:#146ef6;color:#fff;height:25px;
                                width:25px;border-radius:50%;margin-left:10px;display:flex;justify-content:center;align-items:center;
                                `);
                        labelElementContact.textContent = "C";
                        labelElementContact.setAttribute("style", `background-color:#146ef6;color:#fff;height:25px;
                                    width:25px;border-radius:50%;margin-left:10px;display:flex;justify-content:center;align-items:center;
                                    `);

                        for (let ii = 0; ii < emailPhoneData.length; ii++) {
                            let a = emailPhoneData[ii];


                            if (profile.linkedin_url.toLowerCase().startsWith(a.linkedinUrl.toLowerCase())) {

                                if (a.peopleDataEmails.length > 0 && a.rocketReachDataEmails.length > 0 && a.contactOutDataEmails.length > 0) {


                                    email_main_div.className = 'f-12 email_main_div d-flex-align-items-center my-1';

                                    const email_label = document.createElement('b');
                                    email_label.className = 'email_label mx-1';
                                    email_label.textContent = "Email:";
                                    email_main_div.appendChild(email_label);

                                    const email = document.createElement('div');
                                    email.className = 'email';
                                    email.textContent = a.peopleDataEmails[0];
                                    email_main_div.appendChild(email);

                                    email_main_div.appendChild(labelElementPeople.cloneNode(true));
                                    email_main_div.appendChild(labelElementRocket.cloneNode(true));
                                    email_main_div.appendChild(labelElementContact.cloneNode(true))
                                    profileCard.appendChild(email_main_div);


                                    profile.hasEmail = true;


                                }

                                if (a.peopleDataEmails.length > 0 && a.rocketReachDataEmails.length > 0 && a.contactOutDataEmails.length === 0) {


                                    email_main_div.className = 'f-12 email_main_div d-flex-align-items-center my-1';

                                    const email_label = document.createElement('b');
                                    email_label.className = 'email_label mx-1';
                                    email_label.textContent = "Email:";
                                    email_main_div.appendChild(email_label);

                                    const email = document.createElement('div');
                                    email.className = 'email';
                                    email.textContent = a.peopleDataEmails[0];
                                    email_main_div.appendChild(email);

                                    email_main_div.appendChild(labelElementPeople.cloneNode(true));
                                    email_main_div.appendChild(labelElementRocket.cloneNode(true));

                                    profileCard.appendChild(email_main_div);


                                    profile.hasEmail = true;


                                }

                                if (a.peopleDataEmails.length > 0 && a.rocketReachDataEmails.length === 0 && a.contactOutDataEmails.length === 0) {


                                    email_main_div.className = 'f-12 email_main_div d-flex-align-items-center my-1';

                                    const email_label = document.createElement('b');
                                    email_label.className = 'email_label mx-1';
                                    email_label.textContent = "Email:";
                                    email_main_div.appendChild(email_label);

                                    const email = document.createElement('div');
                                    email.className = 'email';
                                    email.textContent = a.peopleDataEmails[0];
                                    email_main_div.appendChild(email);

                                    email_main_div.appendChild(labelElementPeople.cloneNode(true));


                                    profileCard.appendChild(email_main_div);


                                    profile.hasEmail = true;


                                }
                                /// end 

                                if (a.peopleDataEmails.length > 0 && a.rocketReachDataEmails.length === 0 && a.contactOutDataEmails.length) {


                                    email_main_div.className = 'f-12 email_main_div d-flex-align-items-center my-1';

                                    const email_label = document.createElement('b');
                                    email_label.className = 'email_label mx-1';
                                    email_label.textContent = "Email:";
                                    email_main_div.appendChild(email_label);

                                    const email = document.createElement('div');
                                    email.className = 'email';
                                    email.textContent = a.peopleDataEmails[0];
                                    email_main_div.appendChild(email);

                                    email_main_div.appendChild(labelElementPeople.cloneNode(true));
                                    email_main_div.appendChild(labelElementContact.cloneNode(true))

                                    profileCard.appendChild(email_main_div);


                                    profile.hasEmail = true;


                                }

                                if (a.peopleDataEmails.length === 0 && a.rocketReachDataEmails.length > 0 && a.contactOutDataEmails.length > 0) {
                                    console.log("is coming to this", labelElementRocket)

                                    email_main_div.className = 'f-12 email_main_div d-flex-align-items-center my-1';

                                    const email_label = document.createElement('b');
                                    email_label.className = 'email_label mx-1';
                                    email_label.textContent = "Email:";
                                    email_main_div.appendChild(email_label);

                                    const email = document.createElement('div');
                                    email.className = 'email';
                                    email.textContent = a.rocketReachDataEmails[0];
                                    email_main_div.appendChild(email);

                                    email_main_div.appendChild(labelElementContact.cloneNode(true));
                                    email_main_div.append(labelElementRocket.cloneNode(true))

                                    profileCard.appendChild(email_main_div);


                                    profile.hasEmail = true;


                                }

                                if (a.peopleDataEmails.length === 0 && a.rocketReachDataEmails.length > 0 && a.contactOutDataEmails.length === 0) {


                                    email_main_div.className = 'f-12 email_main_div d-flex-align-items-center my-1';

                                    const email_label = document.createElement('b');
                                    email_label.className = 'email_label mx-1';
                                    email_label.textContent = "Email:";
                                    email_main_div.appendChild(email_label);

                                    const email = document.createElement('div');
                                    email.className = 'email';
                                    email.textContent = a.rocketReachDataEmails[0];
                                    email_main_div.appendChild(email);
                                    email_main_div.appendChild(labelElementRocket.cloneNode(true))

                                    profileCard.appendChild(email_main_div);


                                    profile.hasEmail = true;


                                }

                                if (a.peopleDataEmails.length == 0 && a.rocketReachDataEmails.length == 0 && a.contactOutDataEmails.length > 0) {


                                    email_main_div.className = 'f-12 email_main_div d-flex-align-items-center my-1';

                                    const email_label = document.createElement('b');
                                    email_label.className = 'email_label mx-1';
                                    email_label.textContent = "Email:";
                                    email_main_div.appendChild(email_label);

                                    const email = document.createElement('div');
                                    email.className = 'email';
                                    email.textContent = a.contactOutDataEmails[0];
                                    email_main_div.appendChild(email);
                                    email_main_div.appendChild(labelElementContact.cloneNode(true))

                                    profileCard.appendChild(email_main_div);


                                    profile.hasEmail = true;


                                }

                                // Form Mobile



                                if (a.peopleDataPhones.length && a.rocketReachDataPhones.length && !a.contactOutDataPhones.length) {


                                    phone_main_div.className = 'f-12 phone_main_div d-flex-align-items-center my-1';

                                    const phone_label = document.createElement('b');
                                    phone_label.className = 'phone_label mx-1';
                                    phone_label.textContent = "Phone:";
                                    phone_main_div.appendChild(phone_label);

                                    const phone = document.createElement('div');
                                    phone.className = 'phone';
                                    phone.textContent = a.peopleDataPhones[0];
                                    phone_main_div.appendChild(phone);
                                    phone_main_div.appendChild(labelElementPeople.cloneNode(true));
                                    phone_main_div.appendChild(labelElementRocket.cloneNode(true));

                                    profileCard.appendChild(phone_main_div);


                                }

                                if (a.peopleDataPhones.length && !a.rocketReachDataPhones.length && !a.contactOutDataPhones.length) {


                                    phone_main_div.className = 'f-12 phone_main_div d-flex-align-items-center my-1';

                                    const phone_label = document.createElement('b');
                                    phone_label.className = 'phone_label mx-1';
                                    phone_label.textContent = "Phone:";
                                    phone_main_div.appendChild(phone_label);

                                    const phone = document.createElement('div');
                                    phone.className = 'phone';
                                    phone.textContent = a.peopleDataPhones[0];
                                    phone_main_div.appendChild(phone);
                                    phone_main_div.appendChild(labelElementPeople.cloneNode(true));

                                    profileCard.appendChild(phone_main_div);



                                }
                                /// end 

                                if (a.peopleDataPhones.length && !a.rocketReachDataPhones.length && a.contactOutDataPhones.length) {



                                    phone_main_div.className = 'f-12 phone_main_div d-flex-align-items-center my-1';

                                    const phone_label = document.createElement('b');
                                    phone_label.className = 'phone_label mx-1';
                                    phone_label.textContent = "Phone:";
                                    phone_main_div.appendChild(phone_label);

                                    const phone = document.createElement('div');
                                    phone.className = 'phone';
                                    phone.textContent = a.peopleDataPhones[0];
                                    phone_main_div.appendChild(phone);
                                    phone_main_div.appendChild(labelElementPeople.cloneNode(true));

                                    profileCard.appendChild(phone_main_div);



                                }

                                if (!a.peopleDataPhones.length && a.rocketReachDataPhones.length && a.contactOutDataPhones.length) {



                                    phone_main_div.className = 'f-12 phone_main_div d-flex-align-items-center my-1';

                                    const phone_label = document.createElement('b');
                                    phone_label.className = 'phone_label mx-1';
                                    phone_label.textContent = "Phone:";
                                    phone_main_div.appendChild(phone_label);

                                    const phone = document.createElement('div');
                                    phone.className = 'phone';
                                    phone.textContent = a.rocketReachDataPhones[0];
                                    phone_main_div.appendChild(phone);
                                    phone_main_div.appendChild(labelElementRocket.cloneNode(true));
                                    phone_main_div.appendChild(labelElementContact.cloneNode(true));
                                    profileCard.appendChild(phone_main_div);

                                }


                                if (!a.peopleDataPhones.length && a.rocketReachDataPhones.length && !a.contactOutDataPhones.length) {



                                    phone_main_div.className = 'f-12 phone_main_div d-flex-align-items-center my-1';

                                    const phone_label = document.createElement('b');
                                    phone_label.className = 'phone_label mx-1';
                                    phone_label.textContent = "Phone:";
                                    phone_main_div.appendChild(phone_label);

                                    const phone = document.createElement('div');
                                    phone.className = 'phone';
                                    phone.textContent = a.rocketReachDataPhones[0];
                                    phone_main_div.appendChild(phone);
                                    phone_main_div.appendChild(labelElementRocket.cloneNode(true));
                                    profileCard.appendChild(phone_main_div);


                                }

                                if (a.peopleDataPhones.length == 0 && a.rocketReachDataPhones.length == 0 && a.contactOutDataPhones.length) {


                                    phone_main_div.className = 'f-12 phone_main_div d-flex-align-items-center my-1';

                                    const phone_label = document.createElement('b');
                                    phone_label.className = 'phone_label mx-1';
                                    phone_label.textContent = "Phone:";
                                    phone_main_div.appendChild(phone_label);

                                    const phone = document.createElement('div');
                                    phone.className = 'phone';
                                    phone.textContent = a.contactOutDataPhones[0];
                                    phone_main_div.appendChild(phone);
                                    phone_main_div.appendChild(labelElementContact.cloneNode(true));
                                    profileCard.appendChild(phone_main_div);


                                }


                                if (a.peopleDataPhones.length && a.rocketReachDataPhones.length && a.contactOutDataPhones.length) {



                                    phone_main_div.className = 'f-12 phone_main_div d-flex-align-items-center my-1';

                                    const phone_label = document.createElement('b');
                                    phone_label.className = 'phone_label mx-1';
                                    phone_label.textContent = "Phone:";
                                    phone_main_div.appendChild(phone_label);

                                    const phone = document.createElement('div');
                                    phone.className = 'phone';
                                    phone.textContent = a.peopleDataPhones[0];
                                    phone_main_div.appendChild(phone);
                                    phone_main_div.appendChild(labelElementPeople.cloneNode(true));
                                    phone_main_div.appendChild(labelElementRocket.cloneNode(true));
                                    phone_main_div.appendChild(labelElementContact.cloneNode(true))
                                    profileCard.appendChild(phone_main_div);




                                }

                                // if (a.rocketReachDataEmails[0]) {
                                //     const email_main_div = document.createElement('div');
                                //     email_main_div.className = 'f-12 email_main_div d-flex-align-items-center my-1';

                                //     const email_label = document.createElement('b');
                                //     email_label.className = 'email_label mx-1';
                                //     email_label.textContent = "Email:";
                                //     email_main_div.appendChild(email_label);

                                //     const email = document.createElement('div');
                                //     email.className = 'email';
                                //     email.textContent = a.rocketReachDataEmails[0];
                                //     email_main_div.appendChild(email);
                                //     const labelElement = document.createElement("span");

                                //     labelElement.textContent = "R";
                                //     labelElement.setAttribute("style", `background-color:#146ef6;color:#fff;height:25px;
                                //         width:25px;border-radius:50%;margin-left:10px;display:flex;justify-content:center;align-items:center;
                                //         `);
                                //     email_main_div.appendChild(labelElement)
                                //     // profileCard.appendChild(email_main_div);


                                //     profile.hasEmail = true;

                                // }

                                // if (a.contactOutDataEmails[0]) {
                                //     const email_main_div = document.createElement('div');
                                //     email_main_div.className = 'f-12 email_main_div d-flex-align-items-center my-1';

                                //     const email_label = document.createElement('b');
                                //     email_label.className = 'email_label mx-1';
                                //     email_label.textContent = "Email:";
                                //     email_main_div.appendChild(email_label);

                                //     const email = document.createElement('div');
                                //     email.className = 'email';
                                //     email.textContent = a.contactOutDataEmails[0];
                                //     email_main_div.appendChild(email);
                                //     const labelElement = document.createElement("span");

                                //     labelElement.textContent = "C";
                                //     labelElement.setAttribute("style", `background-color:#146ef6;color:#fff;height:25px;
                                //         width:25px;border-radius:50%;margin-left:10px;display:flex;justify-content:center;align-items:center;
                                //         `);
                                //     email_main_div.appendChild(labelElement)
                                //     profileCard.appendChild(email_main_div);


                                //     profile.hasEmail = true;

                                // }



                                break;
                            }



                        }



                        let email_icon_style = ``;
                        if (profile.hasEmail) {
                            email_icon_style = `border: 1px solid;
                                padding: 5px;
                                display: flex;
                                justify-content: center;
                                cursor: pointer;
                                align-items: center;
                                border-top-left-radius: 5px;
                                border-bottom-left-radius: 5px;`
                        }
                        else {
                            email_icon_style = `border: 1px solid #999999;
                            background-color: #cccccc;
                            color: #666666;
                                padding: 5px;
                                display: flex;
                                justify-content: center;
                                cursor: pointer;
                                align-items: center;
                                border-top-left-radius: 5px;
                                border-bottom-left-radius: 5px;`
                        }

                        let mobile_icon_style = ``;
                        if (profile.hasMobile) {
                            mobile_icon_style = `
                            border: 1px solid;
                            padding: 5px;
                            display: flex;
                            cursor: pointer;
                            justify-content: center;
                            align-items: center;
        
                            `
                        }
                        else {
                            mobile_icon_style = `
                            border: 1px solid #999999;
                             background-color: #cccccc;
                             color: #666666;
                             padding: 5px;
                             display: flex;
                             cursor: pointer;
                             justify-content: center;
                             align-items: center;
                             `

                        }

                        const connectButton = document.createElement("div");

                        connectButton.innerHTML = `
                          <span title="Connect">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            fill="currentColor" class="mx-3 bi bi-people" viewBox="0 0 16 16">
                            <path
                                d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                        </svg>
                         
                    </span>
                   
                        `;

                        const messagebutton = document.createElement("div");

                        messagebutton.innerHTML = `<span title="Message">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="mx-3 bi bi-chat-square-text" viewBox="0 0 16 16" style="position:relative;top:2px">
                        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                        <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                        </svg>
                        </span>`;
                        if (profile.saved) {
                            connectButton.setAttribute('style', `
                                border: 1px solid;
                                padding: 5px;
                                display: flex;
                                font-size: 15px;
                                justify-content: center;
                                cursor: pointer;
                                align-items: center;
                                border-top-right-radius: 0px;
                                border-bottom-right-radius: 0px;`
                            );
                            messagebutton.setAttribute('style', `
                                border: 1px solid;
                                padding: 5px;
                                display: flex;
                                font-size: 15px;
                                justify-content: center;
                                cursor: pointer;
                                align-items: center;
                                border-top-right-radius: 0px;
                                border-bottom-right-radius: 0px;`
                            );
                            const email_menu = document.createElement('div');
                            email_menu.className = profile.hasEmail ? 'email-menu email-open-modal' : "email-menu email-disabled";
                            email_menu.setAttribute("data-url", profile.linkedin_url);
                            email_menu.setAttribute("data-userId", profile.userId ? profile.userId : 0);
                            email_menu.setAttribute('style', email_icon_style);
                            if (!profile.hasEmail) {
                                email_menu.setAttribute('title', "Upgrade to get email");
                            }
                            else {
                                email_menu.removeAttribute("title")
                            }
                            email_menu.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mx-3 bi bi-envelope-at" viewBox="0 0 16 16" data-url=${profile.linkedin_url} data-userId=${profile.userId}>
                                    <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z"/>
                                    <path d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648m-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z"/>
                                </svg>
                            `;

                            const mobile_menu = document.createElement('div');
                            mobile_menu.className = 'mobile_menu';
                            mobile_menu.setAttribute('style', `
                                border: 1px solid;
                                padding: 5px;
                                display: flex;
                                cursor: pointer;
                                justify-content: center;
                                align-items: center;`
                            );
                            mobile_menu.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mx-3 bi bi-telephone" viewBox="0 0 16 16">
                                    <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                                </svg>
                            `;

                            const pool_menu = document.createElement('div');
                            pool_menu.setAttribute("data-url", profile.linkedin_url);
                            pool_menu.setAttribute("data-userId", profile.userId ? profile.userId : 0);
                            pool_menu.className = 'pool-menu';
                            pool_menu.setAttribute("title", profile.poolCount > 0 ? `in ${profile.poolCount} Pool ` : "Add to Pool");
                            pool_menu.setAttribute('style', `
                                border: 1px solid;
                                padding: 5px;
                                display: flex;
                                cursor: pointer;
                                justify-content: center;
                                align-items: center;`
                            );
                            pool_menu.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mx-3 bi bi-person-lines-fill" viewBox="0 0 16 16" data-url=${profile.linkedin_url} data-userId=${profile.userId}>
                                    <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"/>
                                </svg><span class="pos-count">${profile.poolCount ? profile.poolCount : ""}</span>
                            `;

                            const send_menu = document.createElement('div');
                            send_menu.setAttribute("data-url", profile.linkedin_url);
                            send_menu.setAttribute("data-userId", profile.userId ? profile.userId : 0);
                            send_menu.setAttribute("title", profile.sequenceCount > 0 ? `in ${profile.sequenceCount} Sequence ` : "Add to Sequence");
                            // send_menu.className = "popup-div"
                            // send_menu.setAttribute("id", "search-button")
                            send_menu.className = 'send-menu popup-div';
                            send_menu.setAttribute('style', `
                                border: 1px solid;
                                padding: 5px;
                                display: flex;
                                cursor: pointer;
                                justify-content: center;
                                align-items: center;`
                            );
                            send_menu.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mx-3 bi bi-send" viewBox="0 0 16 16" data-url=${profile.linkedin_url} data-userId=${profile.userId}>
                                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                                </svg>
                                <span class="pos-count">${profile.sequenceCount ? profile.sequenceCount : ""}</span>
                            `;

                            const three_dots = document.createElement('div');
                            three_dots.className = 'three-dots-menu';
                            three_dots.setAttribute('style', `
                                border: 1px solid;
                                padding: 5px;
                                display: flex;
                                cursor: pointer;
                                justify-content: center;
                                border-top-right-radius: 5px;
                                border-bottom-right-radius: 5px;
                                align-items: center;`
                            );
                            three_dots.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mx-3 bi bi-three-dots" viewBox="0 0 16 16">
                                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                                </svg>
                            `;

                            const main_div_of_menus = document.createElement('div');
                            main_div_of_menus.className = 'main-div-of-menus my-5';
                            main_div_of_menus.appendChild(email_menu);
                            // main_div_of_menus.appendChild(mobile_menu);
                            main_div_of_menus.appendChild(pool_menu);
                            main_div_of_menus.appendChild(send_menu);

                            if (profile.is_first_connection) {
                                main_div_of_menus.appendChild(messagebutton)
                            }

                            else {
                                main_div_of_menus.appendChild(connectButton)
                            }
                            main_div_of_menus.appendChild(three_dots);
                            main_div_of_menus.setAttribute('style', `display: flex;align-items: center;`);

                            // for Campaign
                            const popupDiv = document.createElement("div");
                            popupDiv.setAttribute("id", `popup-${profile.userId}`);
                            // popupDiv.setAttribute("style", `display:none`);

                            popupDiv.classList = "autocomplete-popup";
                            const inputElement = document.createElement("input");
                            inputElement.classList = "autocomplete-input";
                            inputElement.setAttribute("id", `autocompleteInput-${profile.userId}`);
                            inputElement.setAttribute("placeholder", `Search...`);

                            const listElement = document.createElement("ul");
                            listElement.classList = "autocomplete-list-campaign";
                            listElement.setAttribute("id", `autocompleteList-${profile.userId}`);
                            popupDiv.append(inputElement, listElement)

                            //end campaign

                            //for Pool
                            const popupPoolDiv = document.createElement("div");
                            popupPoolDiv.setAttribute("id", `pool-popup-${profile.userId}`);
                            // popupDiv.setAttribute("style", `display:none`);

                            popupPoolDiv.classList = "pool-autocomplete-popup";
                            const inputPoolElement = document.createElement("input");
                            inputPoolElement.classList = "pool-autocomplete-input";
                            inputPoolElement.setAttribute("id", `autocompleteInput-pool-${profile.userId}`);
                            inputPoolElement.setAttribute("placeholder", `Search...`);

                            const listPoolElement = document.createElement("ul");
                            listPoolElement.classList = "autocomplete-list-campaign";
                            listPoolElement.setAttribute("id", `autocompleteList-pool-${profile.userId}`);
                            popupPoolDiv.append(inputPoolElement, listPoolElement)
                            //end pool

                            main_div_of_menus.appendChild(popupDiv);
                            main_div_of_menus.appendChild(popupPoolDiv);

                            // console.log(popup, 'popup')



                            // document.addEventListener('click', (e) => {
                            //     if (!popup.contains(e.target) && e.target !== popup) {
                            //         popup.style.display = 'none';
                            //     }
                            // });
                            profileCard.appendChild(main_div_of_menus);
                            send_menu.addEventListener('click', async (event) => {
                                event.stopPropagation();
                                const siblings = document.querySelectorAll('.pool-autocomplete-popup');
                                console.log('filterItems here', siblings)
                                const filteredSiblings = Array.from(siblings).filter(sibling => sibling !== event.target);

                                filteredSiblings.forEach(function (sibling) {
                                    sibling.classList.remove('visible-popup');
                                });
                                selectedElement = event.target;
                                const popup = document.getElementById(`popup-${profile.userId}`);
                                console.log("is clill", popup)
                                popup.classList.toggle('visible-popup');
                                const input = document.getElementById(`autocompleteInput-${profile.userId}`);
                                const autocompleteList = document.getElementById(`autocompleteList-${profile.userId}`);
                                const query = input.value.toLowerCase();
                                const filteredItems = await getSequenceList(query);
                                filteredItems.list.forEach(item => {
                                    const li = document.createElement('li');
                                    li.textContent = item.sequenceName;
                                    li.addEventListener('click', async () => {

                                        input.value = item.sequenceName;
                                        let resp = await saveSequence(item.sequenceId);
                                        popup.classList.remove('visible-popup');
                                        if (resp.Success) {
                                            Swal.fire({
                                                // position: "top-end",
                                                icon: "success",
                                                title: "Campaign Saved Successfully",
                                                showConfirmButton: false,
                                                timer: 1500
                                            });
                                        }
                                        else {
                                            Swal.fire({
                                                // position: "top-end",
                                                icon: "error",
                                                title: "Error occured while saving campaign",
                                                showConfirmButton: false,
                                                timer: 1500
                                            });
                                        }

                                    });
                                    autocompleteList.appendChild(li);
                                });
                                input.addEventListener('input', async () => {
                                    const query_search = input.value.toLowerCase();
                                    const filteredItemsNew = await getSequenceList(query_search);
                                    autocompleteList.innerHTML = ''; // Clear previous suggestions
                                    filteredItemsNew.list.forEach(item => {
                                        const li = document.createElement('li');
                                        li.textContent = item.sequenceName;
                                        li.addEventListener('click', async () => {
                                            input.value = item.sequenceName;
                                            let resp = await saveSequence(item.sequenceId);
                                            popup.classList.remove('visible-popup');
                                            if (resp.Success) {
                                                Swal.fire({
                                                    // position: "top-end",
                                                    icon: "success",
                                                    title: "Campaign Saved Successfully",
                                                    showConfirmButton: false,
                                                    timer: 1500
                                                });
                                            }
                                            else {
                                                Swal.fire({
                                                    // position: "top-end",
                                                    icon: "error",
                                                    title: "Error occured while saving campaign",
                                                    showConfirmButton: false,
                                                    timer: 1500
                                                });
                                            }

                                            // autocompleteList.innerHTML = ''; // Close popup after selecting
                                        });
                                        autocompleteList.appendChild(li);
                                    });

                                });

                            });

                            pool_menu.addEventListener('click', async (event) => {
                                event.stopPropagation();
                                const siblings = document.querySelectorAll('.autocomplete-popup');
                                console.log('filterItems here', siblings)
                                const filteredSiblings = Array.from(siblings).filter(sibling => sibling !== event.target);

                                filteredSiblings.forEach(function (sibling) {
                                    sibling.classList.remove('visible-popup');
                                });
                                selectedElement = event.target;
                                const popup = document.getElementById(`pool-popup-${profile.userId}`);
                                console.log("is clill", popup)
                                popup.classList.toggle('visible-popup');
                                const input = document.getElementById(`autocompleteInput-pool-${profile.userId}`);
                                const autocompleteList = document.getElementById(`autocompleteList-pool-${profile.userId}`);
                                const query = input.value.toLowerCase();
                                const filteredItems = await getPoolList(query);
                                filteredItems.list.forEach(item => {
                                    const li = document.createElement('li');
                                    li.textContent = item.label;
                                    li.addEventListener('click', async () => {

                                        input.value = item.label;
                                        let resp = await savePoolData(item.id);
                                        popup.classList.remove('visible-popup');
                                        if (resp.Success) {
                                            Swal.fire({
                                                // position: "top-end",
                                                icon: "success",
                                                title: "Campaign Saved Successfully",
                                                showConfirmButton: false,
                                                timer: 1500
                                            });
                                        }
                                        else {
                                            Swal.fire({
                                                // position: "top-end",
                                                icon: "error",
                                                title: "Error occured while saving campaign",
                                                showConfirmButton: false,
                                                timer: 1500
                                            });
                                        }

                                    });
                                    autocompleteList.appendChild(li);
                                });
                                input.addEventListener('input', async () => {
                                    const query_search = input.value.toLowerCase();
                                    const filteredItemsNew = await getPoolList(query_search);
                                    autocompleteList.innerHTML = ''; // Clear previous suggestions
                                    filteredItemsNew.list.forEach(item => {
                                        const li = document.createElement('li');
                                        li.textContent = item.sequenceName;
                                        li.addEventListener('click', async () => {
                                            input.value = item.label;
                                            let resp = await savePoolData(item.id);
                                            popup.classList.remove('visible-popup');
                                            if (resp.Success) {
                                                Swal.fire({
                                                    // position: "top-end",
                                                    icon: "success",
                                                    title: "Pool has been assigned Successfully",
                                                    showConfirmButton: false,
                                                    timer: 1500
                                                });
                                            }
                                            else {
                                                Swal.fire({
                                                    // position: "top-end",
                                                    icon: "error",
                                                    title: "Error occured while saving campaign",
                                                    showConfirmButton: false,
                                                    timer: 1500
                                                });
                                            }

                                            // autocompleteList.innerHTML = ''; // Close popup after selecting
                                        });
                                        autocompleteList.appendChild(li);
                                    });

                                });

                            });






                        } else {
                            connectButton.setAttribute('style', `
                                border: 1px solid;
                                padding: 5px;
                                display: flex;
                                font-size: 15px;
                                justify-content: center;
                                cursor: pointer;
                                align-items: center;
                                border-top-right-radius: 5px;
                                border-bottom-right-radius: 5px;`
                            );
                            messagebutton.setAttribute('style', `
                                border: 1px solid;
                                padding: 5px;
                                display: flex;
                                font-size: 15px;
                                justify-content: center;
                                cursor: pointer;
                                align-items: center;
                                border-top-right-radius: 5px;
                                border-bottom-right-radius: 5px;`
                            );
                            const email_menu = document.createElement('div');
                            email_menu.className = profile.hasEmail ? 'email-menu email-open-modal' : "email-menu email-disabled";
                            email_menu.setAttribute('style', email_icon_style);
                            email_menu.setAttribute("data-url", profile.linkedin_url);
                            email_menu.setAttribute("data-userId", profile.userId ? profile.userId : 0);
                            if (!profile.hasEmail) {
                                email_menu.setAttribute('title', "Upgrade to get email");
                            }
                            else {
                                email_menu.removeAttribute("title")
                            }
                            email_menu.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mx-3 bi bi-envelope" viewBox="0 0 16 16" data-url=${profile.linkedin_url} data-userId=${profile.userId}>
                                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                                </svg>
                            `;

                            const mobile_menu = document.createElement('div');
                            mobile_menu.className = 'mobile_menu';
                            mobile_menu.setAttribute('style', `
                                border: 1px solid;
                                padding: 5px;
                                display: flex;
                                cursor: pointer;
                                justify-content: center;
                                align-items: center;`
                            );
                            mobile_menu.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mx-3 bi bi-telephone" viewBox="0 0 16 16">
                                    <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                                </svg>
                            `;

                            const save_menu = document.createElement('div');
                            save_menu.className = 'email-menu';
                            save_menu.setAttribute('style', `
                                border: 1px solid;
                                padding: 5px;
                                display: flex;
                                font-size: 15px;
                                justify-content: center;
                                cursor: pointer;
                                align-items: center;
                                border-top-right-radius: 0px;
                                border-bottom-right-radius: 0px;`
                            );
                            save_menu.innerHTML = `<span title="Save"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="mx-3 bi bi-save" viewBox="0 0 16 16" style="position:relative;top:2px;">
                            <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1z"/>
                            </svg></span>`;

                            const main_div_of_menus = document.createElement('div');
                            main_div_of_menus.className = 'main-div-of-menus my-5';
                            main_div_of_menus.appendChild(email_menu);
                            // main_div_of_menus.appendChild(mobile_menu);
                            main_div_of_menus.appendChild(save_menu);

                            if (profile.is_first_connection) {
                                main_div_of_menus.appendChild(messagebutton)
                            }

                            else {
                                main_div_of_menus.appendChild(connectButton)
                            }
                            save_menu.addEventListener(('click'), async () => {
                                let userData = await getFromStorage(['iframeData']);
                                const savedResp = await saveData([profile.linkedin_url.split("?")[0]], userData.iframeData.recrId);
                                profile.saved = true;
                                chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
                                    let tabId = tabs[0].id;
                                    chrome.tabs.sendMessage(tabId, { type: "RE_CALL_METHOD_FOR_UPDATE_UI", data: searchList }, (response) => { })
                                })
                            })
                            main_div_of_menus.setAttribute('style', `display: flex;align-items: center;`);

                            profileCard.appendChild(main_div_of_menus);
                        }

                        document.querySelectorAll("#" + btoa(profile.linkedin_url).replace(/[^a-zA-Z]/g, '')).length == 0 ? '' : document.querySelectorAll("#" + btoa(profile.linkedin_url).replace(/[^a-zA-Z]/g, ''))[0].remove()
                        profilesContainer.appendChild(profileCard)
                        index++;


                    }
                })

                sendResponse({ response: "Hello from background script" });
            } catch (e) {
            } finally {
                setTimeout(() => {
                    document.querySelector('.ovrly').style.display = "none";
                }, 2000);
                resolve(true);
            }
        }).then(() => {
            sendResponse({ response: "Hello from background script" });
        })
        return true;
    }
    if (request.type === "PING") {
        sendResponse({ response: "Hello from background script" });
    }
});


const openLinkInNewTab = (url) => {
    window.open(url, '_blank');
}


document.getElementById('select_all').addEventListener('change', (data) => {
    document.getElementById('first_connection').checked = false;
    document.getElementById('second_connection').checked = false;
    if (data.target.checked) {
        document.querySelector(".bottom-done_btn").style.display = "block";
        document.getElementById('actionButton').classList.remove('d-flex-importent');
        document.getElementById('actionButton').classList.add('d-none-importent');
        // document.getElementById('downBtn').classList.remove('d-none-importent');
        document.getElementById('downBtn').classList.add('d-flex-importent');
    } else {
        document.querySelector(".bottom-done_btn").style.display = "none";
    }
    document.querySelectorAll('[id^="CK_BOX_"]').forEach((a) => {
        a.checked = data.target.checked;
    })
})


// popup

// Get modal element
var modal = document.getElementById('myModal');

// Get open modal button
var openModalBtn = document.getElementById('openModalBtn');
console.log(openModalBtn, 'openModalBtn')
var optionDiv = document.getElementById("myDownArrow");
console.log(optionDiv, 'optionDiv')
var openModalBtn_svg = document.getElementById('openModalBtn_svg');

// Get close button
var closeBtn = document.getElementsByClassName('close')[0];

// Get submit button
var submitMessageBtn = document.getElementById('submitMessage');
var withoutMessage = document.getElementById('withoutMessage');

// Get textarea
var messageInput = document.getElementById('messageInput');

// var task_tab = document.getElementById('task_tab');

// var prospect_tab = document.getElementById('prospect_tab');

var first_connection = document.getElementById('first_connection');
var second_connection = document.getElementById('second_connection');


first_connection.addEventListener('change', async (e) => {
    document.getElementById('actionButton').classList.remove('d-none-importent');
    document.getElementById('actionButton').classList.add('d-flex-importent');
    // document.getElementById('downBtn').classList.remove('d-none-importent');
    document.getElementById('downBtn').classList.add('d-flex-importent');
    second_connection.checked = false;
    document.getElementById("select_all").checked = false;
    document.querySelectorAll('[id^="CK_BOX_"]').forEach((a) => { a.checked = false; })
    if (e.target.checked) {
        await chrome.storage.sync.set({ 'actionType': 'SEND_MESSAGES' });
        first_connection.checked = true;
        document.querySelector('#openModalBtn').textContent = 'Messages'
        withoutMessage.style.display = 'none';
        submitMessageBtn.textContent = 'Start Send Messages';
        openModalBtn_svg.innerHTML = message_svg;
        let { listOfConnectionSended } = await chrome.storage.sync.get(['listOfConnectionSended']);
        searchList.forEach((a) => {
            if (a.is_first_connection || listOfConnectionSended.some((k) => k.src === String(a.linkedin_url).split('?')[0])) {
                document.querySelector(`#CK_BOX_${a.id}`).checked = true;
            }
        })
    }
})

second_connection.addEventListener('change', async (e) => {
    document.getElementById('actionButton').classList.remove('d-none-importent');
    document.getElementById('actionButton').classList.add('d-flex-importent');
    document.getElementById('downBtn').classList.remove('d-none-importent');
    document.getElementById('downBtn').classList.add('d-flex-importent');
    first_connection.checked = false;
    document.getElementById("select_all").checked = false;
    document.querySelectorAll('[id^="CK_BOX_"]').forEach((a) => { a.checked = false; })
    if (e.target.checked) {
        await chrome.storage.sync.set({ 'actionType': 'SEND_REQUEST' });
        second_connection.checked = true;
        document.querySelector('#openModalBtn').textContent = 'Connect'
        withoutMessage.style.display = 'block';
        submitMessageBtn.textContent = 'With Message';
        openModalBtn_svg.innerHTML = connect_svg;
        let { listOfConnectionSended } = await chrome.storage.sync.get(['listOfConnectionSended']);
        searchList.forEach((a) => {
            if (listOfConnectionSended == null || listOfConnectionSended.length == 0) {
                if (!a.is_first_connection) {
                    document.querySelector(`#CK_BOX_${a.id}`).checked = true;
                }
            } else if (listOfConnectionSended != null && listOfConnectionSended.length > 0) {
                if (!a.is_first_connection && !listOfConnectionSended.some((k) => k.src === String(a.linkedin_url).split('?')[0])) {
                    document.querySelector(`#CK_BOX_${a.id}`).checked = true;
                }
            }
        })
    }
})

// task_tab.addEventListener('click',()=>{

//     document.getElementById('prospect_tab_ele').style.display='none';
//     document.getElementById('task_tab_ele').style.display='block';

//     document.getElementById('prospect_tab_svg').style.fill='gray';
//     document.getElementById('prospect_tab_text').style.color='gray';

//     document.getElementById('task_tab_svg').style.fill='#146ef6';
//     document.getElementById('task_tab_text').style.color='#146ef6';
// });

// prospect_tab.addEventListener('click',()=>{

//     document.getElementById('prospect_tab_ele').style.display='block';
//     document.getElementById('task_tab_ele').style.display='none';

//     document.getElementById('task_tab_svg').style.fill='gray';
//     document.getElementById('task_tab_text').style.color='gray';

//     document.getElementById('prospect_tab_svg').style.fill='#146ef6';
//     document.getElementById('prospect_tab_text').style.color='#146ef6';
// });


// Open modal event
openModalBtn.onclick = function () {
    messageInput.value = '';
    modal.style.display = 'block';
}

optionDiv.onclick = function () {
    console.log("vvv")
    const sendRequestPopup = document.querySelector(".sendRequest");
    const downIcon = document.querySelector(".arrow-icon");
    const optionElements = document.querySelectorAll(".option-element");

    sendRequestPopup.classList.toggle('minimized');
    if (sendRequestPopup.classList.contains('minimized')) {
        _.forEach(optionElements, function (ele) {
            ele.style.display = "none";
        })
        downIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor"
                        class="bi bi-arrow-up-circle-fill" viewBox="0 0 16 16">
                        <path
                            d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z" />
                    </svg>`;
    } else {
        _.forEach(optionElements, function (ele) {
            ele.style.display = "block";
        })
        downIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor"
                            class="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
                            <path
                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                        </svg>`;
    }
}

// Close modal event
closeBtn.onclick = function () {
    modal.style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }

}

function clearActiveClass() {
    const siblings = document.querySelectorAll('.autocomplete-popup');
    console.log(siblings, 'siblings here')
    siblings.forEach(function (sibling) {
        sibling.classList.remove('visible-popup');
    });
}

function clearActivePoolClass() {
    const siblings = document.querySelectorAll('.pool-autocomplete-popup');
    // console.log(siblings, 'siblings here')
    siblings.forEach(function (sibling) {
        sibling.classList.remove('visible-popup');
    });
}
document.addEventListener('click', function (event) {
    console.log("he")

    const containers = document.querySelectorAll('.send-menu');

    containers.forEach(function (container) {
        // If the click is outside the container
        if (!event.target.classList.contains('autocomplete-popup') && !event.target.classList.contains('autocomplete-input')) {
            clearActiveClass(); // Clear active class from siblings
        }
    });
    const poolContainers = document.querySelectorAll('.pool-menu');

    poolContainers.forEach(function (container) {
        // If the click is outside the container
        if (!event.target.classList.contains('pool-autocomplete-popup') && !event.target.classList.contains('pool-autocomplete-input')) {
            clearActivePoolClass(); // Clear active class from siblings
        }
    });



});

const parentContainer = document.querySelector('.profile-card');
parentContainer.addEventListener('click', function (event) {
    event.stopPropagation(); // Prevent the event from bubbling up to the document
});

// Submit message event
submitMessageBtn.onclick = function () {
    var message = messageInput.value;
    if (message.trim()) {
        let filterList = filterListHowManyChecked();
        chrome.storage.sync.get(['actionType']).then(async (actionType) => {
            if (actionType['actionType'] == 'SEND_REQUEST') {
                chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
                    let tabId = tabs[0].id;
                    unCheckAllChecked();
                    let uniqueList = await filterAlreadySentConnection(filterList);
                    if (uniqueList.length != 0 && filterList != null) {
                        chrome.tabs.sendMessage(tabId, { message: "ADD_TO_CONNECTION", data: uniqueList, dm: message }, (response) => { })
                    }
                })
            } else if (actionType['actionType'] == 'SEND_MESSAGES') {
                chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
                    let tabId = tabs[0].id;
                    unCheckAllChecked();
                    chrome.tabs.sendMessage(tabId, { message: "SEND_PERSONALIZED_MESSAGE", data: filterList, dm: message }, (response) => { })
                })
            }
        })
        modal.style.display = 'none';
    }
}

const unCheckAllChecked = () => {
    document.querySelectorAll('[id^="CK_BOX_"]').forEach((a) => { a.checked = false; })
    first_connection.checked = false;
    second_connection.checked = false;
}

const filterAlreadySentConnection = (listOfConnections = []) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await chrome.storage.sync.get(['listOfConnectionSended']);
            const sentConnections = result.listOfConnectionSended || [];

            const filteredConnections = listOfConnections.filter(connection => {
                const connectionUrl = String(connection.linkedin_url).split('?')[0];
                return !sentConnections.some(sent => sent.src === connectionUrl);
            });

            resolve(filteredConnections);
        } catch (error) {
            console.error('Error fetching sent connections:', error);
            reject(listOfConnections);
        }
    })
};


withoutMessage.onclick = () => {
    let filterList = filterListHowManyChecked();
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        let tabId = tabs[0].id;
        unCheckAllChecked();
        let uniqueList = await filterAlreadySentConnection(filterList);
        if (uniqueList.length != 0 && filterList != null) {
            chrome.tabs.sendMessage(tabId, { message: "ADD_TO_CONNECTION", data: uniqueList, dm: '' }, (response) => { })
        }
    })
    modal.style.display = 'none';
}

const filterListHowManyChecked = () => {
    const checkedItems = searchList.filter(item => {
        const checkbox = document.querySelector(`#CK_BOX_${item.id}`);
        return checkbox !== null && checkbox.checked;
    });

    return checkedItems;
};




const start_send_request_process = (filterList, message = null) => {
    if (filterList.length > 0) {
        let requestData = {
            filterList: filterList,
            message: message,
            type: "SEND_REQUEST"
        }
        chrome.tabs.getCurrent((tab) => {
            chrome.tabs.sendMessage(tab.id, requestData, (response) => {
            })
        })
    }
}

const start_send_message_process = (filterList, message = null) => {
    if (filterList.length > 0) {
        let requestData = {
            filterList: filterList,
            message: message,
            type: "SEND_MESSAGES"
        }
        chrome.tabs.getCurrent((tab) => {
            chrome.tabs.sendMessage(tab.id, requestData, (response) => {
            })
        })
    }
}


// let sendRequest = document.getElementById('sendRequest');
// let sendMessages = document.getElementById('sendMessages');

// sendRequest.addEventListener('click',async()=>{
//     await chrome.storage.sync.set({'actionType':'SEND_REQUEST'});
//     document.querySelector('#openModalBtn').textContent='Send Request'
//     withoutMessage.style.display='block';
//     submitMessageBtn.textContent='With Message';
// })

// sendMessages.addEventListener('click',async()=>{
//     await chrome.storage.sync.set({'actionType':'SEND_MESSAGES'});
//     document.querySelector('#openModalBtn').textContent='Send Messages'
//     withoutMessage.style.display='none';
//     submitMessageBtn.textContent='Start Send Messages';
// })


let createNewTask = document.getElementById('createNewTask');
createNewTask.addEventListener('click', (a) => {
    // get current tab id
    addUriModal.classList.add('active');
})

async function getContactDetails(linkedinUrls) {
    const url = 'https://qaadminapi.curately.ai/curatelyAdmin/profile/search';
    let result = await getFromStorage(['iframeData']);
    const clientId = result.iframeData.clientId;

    const data = {
        linkedinUrl: linkedinUrls,
        clientId: clientId,
        recrId: result.iframeData.recrId
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'insomnia/9.3.3'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function saveData(linkedinUrls, recrId) {
    const url = 'https://qaadminapi.curately.ai/curatelyAdmin/saveLinkedinData ';
    let result = await getFromStorage(['iframeData']);
    const clientId = result.iframeData.clientId;
    let dataArr = []
    _.forEach(linkedinUrls, function (url) {
        dataArr.push({
            "url": url,
            "type": 1
        })
    })
    const data = {
        requestInfo: dataArr,
        clientId: clientId,
        recrId
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'insomnia/9.3.3'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}


const getEmailPhoneData = (data) => {
    return new Promise((resolve) => {
        let listOfProfileUrls = data.filter(a => a.linkedin_url && a.linkedin_url !== '').map(a => a.linkedin_url.split("?")[0].toLowerCase()).filter(url => url && url !== '');
        console.log(listOfProfileUrls);
        getContactDetails(listOfProfileUrls).then(result => {
            emailPhoneData = result
            console.log(result, 'result')
            resolve(true);
        }).catch(() => {
            resolve(true);
        })
    })
}

const emailModal = document.getElementById("emailModal");

// const openEmailModalBtns = document.querySelectorAll('.email-menu');

// Get the close button
const closeMailBtn = document.getElementsByClassName("close-mail")[0];

// Get modal title and content elements


// Loop through all open modal buttons and add event listeners
const templateListElement = document.getElementById("templateList");
const templateTypeEle = document.getElementById("mySelect");
const emailSubEle = document.getElementById("emailSubject");
const editorDiv = document.querySelector(".quill-editor");
const emailBodyEle = document.getElementById("emilBody");

const sequenceSaveBtn = document.getElementById("sequenceBtn");
const poolModalOpenBtn = document.getElementById("poolModalBtn");

const assignModal = document.getElementById("assignModal");
const closeAssignModalBtn = document.querySelector(".close-assign-modal");
const assignInputModal = document.getElementById("autocompleteInput-modal");

const assignSaveBtn = document.getElementById("assignModalBtn");
let sequenceId = null;
let poolId = null;
assignSaveBtn.onclick = async function () {

    try {
        let resp = isSequenceModal ? await saveSequence() : await savePoolData();

        assignModal.style.display = "none";
        if (resp.Success) {
            Swal.fire({
                // position: "top-end",
                icon: "success",
                title: isSequenceModal ? "Campaign Saved Successfully" : "Pool has been assigned successfully",
                showConfirmButton: false,
                timer: 1500
            });
        }
        else {
            Swal.fire({
                // position: "top-end",
                icon: "error",
                title: isSequenceModal ? "Error occured while saving campaign" : "Error occured while saving pool",
                showConfirmButton: false,
                timer: 1500
            });
        }

    }
    catch (e) {
        console.log(e);
        Swal.fire({
            // position: "top-end",
            icon: "error",
            title: isSequenceModal ? "Error occured while saving campaign" : "Error occured while saving pool",
            showConfirmButton: false,
            timer: 1500
        });
        assignModal.style.display = "none";
    }
}

sequenceSaveBtn.onclick = async function () {
    const assignTitleEle = document.getElementById("assign-modal-title");
    assignTitleEle.innerText = "Add to Sequence";
    assignInputModal.value = "";
    isSequenceModal = true;
    assignModal.style.display = "block";

}

poolModalOpenBtn.onclick = async function () {
    const assignTitleEle = document.getElementById("assign-modal-title");
    assignTitleEle.innerText = "Add to Pool";
    assignInputModal.value = "";
    isSequenceModal = false;
    assignModal.style.display = "block";

}



assignInputModal.addEventListener('input', async () => {
    console.log("is coming")
    const autocompleteList = document.getElementById(`autocompleteList-modal`);
    autocompleteList.style.display = "block";
    const query = assignInputModal.value.toLowerCase();
    if (isSequenceModal) {
        const filteredItems = await getSequenceList(query);

        autocompleteList.innerHTML = ''; // Clear previous suggestions
        if (filteredItems.list.length > 0) {
            filteredItems.list.forEach(item => {
                autocompleteList.style.height = "auto";

                const li = document.createElement('li');
                li.textContent = item.sequenceName;
                li.setAttribute("data-sequenceId", item.sequenceId)
                li.addEventListener('click', () => {
                    sequenceId = item.sequenceId;
                    assignInputModal.value = item.sequenceName;
                    // Close popup after selecting

                    autocompleteList.style.display = "none"
                });
                autocompleteList.appendChild(li);
            });
        }
        else {

            autocompleteList.style.display = "none"
        }
    }
    else {
        const filteredItems = await getPoolList(query);

        autocompleteList.innerHTML = ''; // Clear previous suggestions
        if (filteredItems.list.length > 0) {
            filteredItems.list.forEach(item => {
                autocompleteList.style.height = "auto";

                const li = document.createElement('li');
                li.textContent = item.label;
                li.setAttribute("data-sequenceId", item.sequenceId)
                li.addEventListener('click', () => {
                    poolId = item.id;
                    assignInputModal.value = item.label;

                    autocompleteList.style.display = "none"
                });
                autocompleteList.appendChild(li);
            });
        }
        else {
            autocompleteList.style.height = "0px";
            autocompleteList.style.display = "none"
        }

    }


});

assignInputModal.addEventListener('focus', async () => {
    console.log("is coming")
    const autocompleteList = document.getElementById(`autocompleteList-modal`);
    autocompleteList.style.display = "block";
    const query = assignInputModal.value.toLowerCase();
    if (isSequenceModal) {
        const filteredItems = await getSequenceList(query);

        autocompleteList.innerHTML = ''; // Clear previous suggestions
        if (filteredItems.list.length > 0) {
            filteredItems.list.forEach(item => {
                autocompleteList.style.height = "auto";

                const li = document.createElement('li');
                li.textContent = item.sequenceName;
                li.setAttribute("data-sequenceId", item.sequenceId)
                li.addEventListener('click', () => {
                    sequenceId = item.sequenceId;
                    assignInputModal.value = item.sequenceName;
                    // Close popup after selecting

                    autocompleteList.style.display = "none"
                });
                autocompleteList.appendChild(li);
            });
        }
        else {

            autocompleteList.style.display = "none"
        }
    }
    else {
        const filteredItems = await getPoolList(query);

        autocompleteList.innerHTML = ''; // Clear previous suggestions
        if (filteredItems.list.length > 0) {
            filteredItems.list.forEach(item => {
                autocompleteList.style.height = "auto";

                const li = document.createElement('li');
                li.textContent = item.label;
                li.setAttribute("data-sequenceId", item.sequenceId)
                li.addEventListener('click', () => {
                    poolId = item.id;
                    assignInputModal.value = item.label;

                    autocompleteList.style.display = "none"
                });
                autocompleteList.appendChild(li);
            });
        }
        else {
            autocompleteList.style.height = "0px";
            autocompleteList.style.display = "none"
        }

    }


});

closeAssignModalBtn.onclick = function () {
    assignModal.style.display = "none";
}


let selectedElement = null;



function setTempalteData(templatesList) {
    console.log(templatesList.TemplatesAutoComplete, 'emplatesList.TemplatesAutoComplete')
    const optionPlaceholderEle = document.createElement("option")
    optionPlaceholderEle.setAttribute("value", "")
    optionPlaceholderEle.textContent = "Please select";
    templateListElement.appendChild(optionPlaceholderEle)
    if (templatesList && templatesList.TemplatesAutoComplete.length > 0) {
        _.forEach(templatesList?.TemplatesAutoComplete, function (template) {
            template.Type = template.Type || template.type
            const optionEle = document.createElement("option")
            optionEle.setAttribute("value", `${template.Type}_${template.templateId}`)
            optionEle.textContent = template.templateName;
            templateListElement.appendChild(optionEle)

        })
    }
    else {
        const optionEle = document.createElement("option")
        optionEle.setAttribute("value", "")
        optionEle.textContent = "No templates found";
        templateListElement.appendChild(optionEle)
    }
}

// templateTypeEle.addEventListener("change", async function (event) {
//     const templateData = await getTemplates(templateTypeEle.value);
//     templateListElement.replaceChildren();
//     setTempalteData(templateData);
// })

templateListElement.addEventListener("change", async function (event) {
    const templateData = await getTemplateDataById(templateListElement.value);
    // templateListElement.replaceChildren();
    // setTempalteData(templateData);
})



const sendEmailBulkEle = document.getElementById("sendBulkEmail");
const subjectModal = document.getElementById("subJectModal");
const closeSubjectBtn = document.querySelector(".close-subject-modal")
closeSubjectBtn.onclick = function () {
    subjectModal.style.display = "none";
}


const sendEmailBtn = document.getElementById("mailSendBtn");
sendEmailBtn.addEventListener("click", async function () {

    let emailResp = await sendEmail()
})

sendEmailBulkEle.addEventListener("click", async function () {
    selectedElement = null;
    emailModal.style.display = "block";

    const templateData = await getTemplates("AllEmailTemplates");
    // const demoUserData = await chrome.storage.local.get("demoUserInfo")
    // console.log(JSON.stringify(demoUserData), 'demoUserData')

    setTempalteData(templateData)
})
// Close the modal when the user clicks on (X)

closeMailBtn.onclick = function () {
    emailModal.style.display = "none";
}
const closeProgressBtn = document.getElementsByClassName("close-progress-modal")[0];


const addTocuratelyBtn = document.getElementById("addToCuratelyBtn")
addTocuratelyBtn.addEventListener("click", addToCurately);

const progressModal = document.getElementById("progressModal");
const progressContent = document.getElementById("progressContent");

closeProgressBtn.onclick = function () {
    progressModal.style.display = "none";
}

function getFromStorage(keys) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(keys, function (result) {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(result);
        });
    });
}


async function getTemplates(type) {
    const url = 'https://qaadminapi.curately.ai/curatelyAdmin/searchTemplates';
    let result = await getFromStorage(['iframeData']);
    const clientId = result.iframeData.clientId;

    const data = {
        clientId,
        "templateName": "",
        "type": type
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'insomnia/9.3.3'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }

}

async function getSequenceList(query = "") {
    const url = 'https://qaadminapi.curately.ai/curatelyAdmin/searchSequence';
    let result = await getFromStorage(['iframeData']);
    const clientId = result.iframeData.clientId;

    const data = {
        clientId,
        "sequenceName": query,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'insomnia/9.3.3'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }

}

async function getPoolList(query = "") {
    const url = 'https://qaadminapi.curately.ai/curatelyAdmin/autocompleteTalentPool';
    let result = await getFromStorage(['iframeData']);
    const clientId = result.iframeData.clientId;

    const data = {
        clientId,
        "search": query,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'insomnia/9.3.3'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }

}



async function getTemplateDataById(templateInfo) {
    let templateVal = templateInfo.split("_");
    // emailBodyEle.innerHTML = "";
    let url = "";
    if (templateVal[0] == "EmailBuilderTemplate") {
        url = `https://qaadminapi.curately.ai/curatelyAdmin/getEmailBuilderTemplatesListById/${templateVal[1]}/3`
    }
    else {
        url = `https://qaadminapi.curately.ai/curatelyAdmin/getEmailTemplatesListById/${templateVal[1]}/3`
    }
    try {
        const templateData = await fetch(
            url

        );

        const templateDetails = await templateData.json();
        if (templateDetails.list && templateDetails.list.length) {
            let templateInfoData = templateDetails.list[0];

            emailSubEle.value = templateInfoData.subject;

            if (templateInfoData.type === "Text") {
                editorDiv.style.display = "block";
                quill?.clipboard.dangerouslyPasteHTML(templateInfoData.description);
                emailBodyEle.style.display = "none"
            }
            else if (templateInfoData.type === "HTML" || templateInfoData.type == 1) {
                editorDiv.style.display = "none";
                emailBodyEle.style.display = "block";
                emailBodyEle.setAttribute("style", `
                    border: 1px solid #CCCCCC;
                    border-radius: 4px;
                    padding: 14px;
                    height: 200px;
                    max-height: 100%;
                    overflow-y: auto;
    `)
                emailBodyEle.innerHTML = templateInfoData.htmlFile;
            }

        }
        console.log(templateDetails, 'templateDetails')
    } catch (error) {
        // Handle response
        console.warn("There was an error fetching jobs: ", error);
        // return {
        //   currentLocation,
        //   searchLocation,
        // };
    }
}

async function sendEmail() {
    const errorTextEle = document.querySelector(".sub-error-text")
    if (!emailSubEle.value) {
        errorTextEle.textContent = "Subject is Mandatory"
        subjectModal.style.display = "block";
        errorTextEle.style.color = "white"
    }
    else {
        subjectModal.style.display = "none"
    }
    const url = 'https://qaadminapi.curately.ai/curatelyAdmin/email/send';

    let templateVal = templateListElement.value.split("_");
    let checkedItems = document.querySelectorAll('[id^="CK_BOX_"]');

    let linkedInData = [];
    if (!selectedElement) {
        _.forEach(checkedItems, function (item) {
            if (item.checked) {
                linkedInData.push({
                    url: item.dataset.url.split("?")[0],
                    type: 1,
                    userId: item.dataset.userid ? parseInt(item.dataset.userid) : 0
                })
            }
        });
    }
    else {
        linkedInData.push({
            url: selectedElement.dataset.url.split("?")[0],
            type: 1,
            userId: (selectedElement.dataset.userid || selectedElement.dataset.userid != "null") ? parseInt(selectedElement.dataset.userid) : 0
        })
    }


    let result = await getFromStorage(['iframeData']);
    const clientId = result.iframeData.clientId;

    console.log(result, 'result')
    if (result.iframeData) {
        recrData.recrId = result.iframeData.recrId;
        recrData.fromEmailId = result.iframeData.email;
        recrData.fromName = result.iframeData.userName
    }

    const finalPostData = {
        ...recrData,
        clientId,
        "subject": emailSubEle.value,
        "body": templateVal[0] === "EmailBuilderTemplate" ? emailBodyEle.innerHTML : quill.root.innerHTML,
        requestInfo: linkedInData
    };

    console.log(finalPostData, 'emailPost')
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'insomnia/9.3.3'
            },
            body: JSON.stringify(finalPostData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.Success) {
            emailModal.style.display = "none";
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }

}

async function saveSequence(sequenceIdVal) {
    const url = 'https://qaadminapi.curately.ai/curatelyAdmin/saveToSequence';
    let result = await getFromStorage(['iframeData']);
    const clientId = result.iframeData.clientId;
    let checkedItems = document.querySelectorAll('[id^="CK_BOX_"]');
    let linkedInData = [];
    if (!selectedElement) {
        _.forEach(checkedItems, function (item) {
            if (item.checked) {
                linkedInData.push({
                    url: item.dataset.url.split("?")[0],
                    type: 1,
                    userId: item.dataset.userid ? parseInt(item.dataset.userid) : 0
                })
            }
        });
    }
    else {
        linkedInData.push({
            url: selectedElement.dataset.url.split("?")[0],
            type: 1,
            userId: (selectedElement.dataset.userid || selectedElement.dataset.userid != "null") ? parseInt(selectedElement.dataset.userid) : 0
        })
    }

    const data = {
        clientId,
        requestInfo: linkedInData,
        "sequenceId": sequenceIdVal ? sequenceIdVal : sequenceId,
        "recrId": result.iframeData.recrId
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'insomnia/9.3.3'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }

}

async function savePoolData(poolIdVal) {
    const url = 'https://qaadminapi.curately.ai/curatelyAdmin/saveToTalentpool';
    let result = await getFromStorage(['iframeData']);
    const clientId = result.iframeData.clientId;
    let checkedItems = document.querySelectorAll('[id^="CK_BOX_"]');
    let linkedInData = [];
    if (!selectedElement) {
        _.forEach(checkedItems, function (item) {
            if (item.checked) {
                linkedInData.push({
                    url: item.dataset.url.split("?")[0],
                    type: 1,
                    userId: item.dataset.userid ? parseInt(item.dataset.userid) : 0
                })
            }
        });
    }
    else {
        linkedInData.push({
            url: selectedElement.dataset.url.split("?")[0],
            type: 1,
            userId: (selectedElement.dataset.userid || selectedElement.dataset.userid != "null") ? parseInt(selectedElement.dataset.userid) : 0
        })
    }

    const data = {
        clientId,
        requestInfo: linkedInData,
        "poolId": poolIdVal ? poolIdVal : poolId,
        "recrId": result.iframeData.recrId
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'insomnia/9.3.3'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }

}




async function addToCurately() {
    let checkedItems = document.querySelectorAll('[id^="CK_BOX_"]');
    let linkedInUrls = [];
    _.forEach(checkedItems, function (item) {
        if (item.checked) {
            linkedInUrls.push(item.dataset.url)
        }
    });
    let finalUrls = linkedInUrls.map(a => a.split("?")[0]).filter(url => url && url !== '');
    // let chars = ['A', 'B', 'A', 'C', 'B'];

    let uniqueUrls = finalUrls.filter((element, index) => {
        return finalUrls.indexOf(element) === index;
    });
    console.log(linkedInUrls, "linkedInUrls", finalUrls)
    progressContent.textContent = `Adding ${uniqueUrls.length} users`;
    progressModal.style.display = "block";

    bar.animate(0.5);
    bar.animate(0.8);

    let userData = await getFromStorage(['iframeData']);
    const savedResp = await saveData(uniqueUrls, userData.iframeData.recrId);

    bar.animate(1);
    bar.set(1.0)
    console.log(bar.value(), 'eeerr')
    if (bar.value() == 1) {
        setTimeout(() => {
            progressModal.style.display = "none";
            // document.querySelector(".bottom-done_btn").style.display = "none";
            bar.set(0)
            chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
                let tabId = tabs[0].id;
                chrome.tabs.sendMessage(tabId, { type: "RE_CALL_METHOD_FOR_UPDATE_UI", data: searchList }, (response) => { })
            })
        }, 500)
    }

    // progressModal.style.display = "none";
}
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("list_of_search").addEventListener("click", async function (event) {

        // Check if a button was clicked
        if (!event.target.closest('.email-open-modal')) {
            return; // Skip the click event if the target class is not found
        }
        event.preventDefault();
        // event.stopPropagation();
        console.log("is click")
        if ((event.target && event.target.classList.contains("email-open-modal")) || (event.target.closest('.email-open-modal'))) {
            console.log("is click com")
            const templateData = await getTemplates("EmailTemplate");
            // const demoUserData = await chrome.storage.local.get("demoUserInfo")
            // console.log(JSON.stringify(demoUserData), 'demoUserData')
            selectedElement = event.target;
            // console.log(selectedElement.dataset, 'selectedElement')
            setTempalteData(templateData)



            // Show the modal
            emailModal.style.display = "block";
        }

    }, true)
});