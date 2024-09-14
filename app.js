"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const form = document.getElementById("resume-form");
const resumeOutput = document.getElementById("resume-output");
const shareLinkDiv = document.getElementById("share-link");
const resumeURLInput = document.getElementById("resume-url");
const copyLinkButton = document.getElementById("copy-link");
const downloadResumeButton = document.getElementById("download-resume");
const profilePicInput = document.getElementById("profile-pic");
const generateUniqueURL = () => {
    const username = document.getElementById("name").value;
    return `${window.location.origin}/${username}/resume`;
};
function generateEditableSection(title, content) {
    return `
    <div class="editable-section">
      <h2>${title}</h2>
      <p class="editable-content" contenteditable="false">${content}</p>
      <div class="button-group">
        <button class="edit-button">Edit</button>
        <button class="save-button hidden">Save</button>
      </div>
    </div>
  `;
}
function generateEditableListSection(title, items) {
    const listItems = items.map((item) => `<li>${item.trim()}</li>`).join("");
    return `
    <div class="editable-section">
      <h2>${title}</h2>
      <ul class="editable-content" contenteditable="false">
        ${listItems}
      </ul>
      <div class="button-group">
        <button class="edit-button">Edit</button>
        <button class="save-button hidden">Save</button>
      </div>
    </div>
  `;
}
function generatePersonalInfoSectionWithEdit(name, email, phone, profilePicSrc) {
    let imgHtml = "";
    if (profilePicSrc) {
        imgHtml = `
      <img src="${profilePicSrc}" alt="Profile Picture" id="profile-pic-output" />
      <div class="button-group">
        <button class="edit-profile-pic-button">Edit Picture</button>
      </div>
    `;
    }
    return `
    <div class="editable-section" id="personal-info-section">
      <h2>Personal Information</h2>
      ${imgHtml}
      <p class="editable-content" contenteditable="false"><strong>Name:</strong> ${name}</p>
      <p class="editable-content" contenteditable="false"><strong>Email:</strong> ${email}</p>
      <p class="editable-content" contenteditable="false"><strong>Phone:</strong> ${phone}</p>
      <div class="button-group">
        <button class="edit-button">Edit</button>
        <button class="save-button hidden">Save</button>
      </div>
    </div>
  `;
}
form.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const education = document.getElementById("education").value;
    const workExperience = document.getElementById("work-experience").value;
    const skills = document.getElementById("skills").value
        .split("\n")
        .filter((skill) => skill.trim() !== "");
    const profilePicFile = (_a = profilePicInput.files) === null || _a === void 0 ? void 0 : _a[0];
    const handleProfilePic = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.onerror = function () {
                reject("Error reading profile picture.");
            };
            reader.readAsDataURL(file);
        });
    };
    const populateResume = (profilePicSrc) => {
        resumeOutput.innerHTML = `
      ${generatePersonalInfoSectionWithEdit(name, email, phone, profilePicSrc)}
      ${generateEditableSection("Education", education)}
      ${generateEditableSection("Work Experience", workExperience)}
      ${generateEditableListSection("Skills", skills)}
    `;
        resumeOutput.classList.remove("hidden");
        shareLinkDiv.classList.remove("hidden");
        const resumeURL = generateUniqueURL();
        resumeURLInput.value = resumeURL;
    };
    if (profilePicFile) {
        try {
            const profilePicSrc = yield handleProfilePic(profilePicFile);
            populateResume(profilePicSrc);
        }
        catch (error) {
            console.error(error);
            populateResume();
        }
    }
    else {
        populateResume();
    }
}));
function toggleEditSave(button, saveButton, contentElement) {
    if (button.textContent === "Edit") {
        contentElement.setAttribute("contenteditable", "true");
        contentElement.focus();
        button.classList.add("hidden");
        saveButton.classList.remove("hidden");
    }
}
function saveContent(button, editButton, contentElement) {
    if (button.textContent === "Save") {
        contentElement.setAttribute("contenteditable", "false");
        button.classList.add("hidden");
        editButton.classList.remove("hidden");
    }
}
function downloadResumeAsPDF() {
    const resumeHtml = resumeOutput.innerHTML;
    const pdfWindow = window.open("", "", "width=800,height=600");
    pdfWindow.document.write("<html><head><title>Resume</title></head><body>");
    pdfWindow.document.write(resumeHtml);
    pdfWindow.document.write("</body></html>");
    pdfWindow.document.close();
    pdfWindow.print();
}
document.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("edit-button")) {
        const button = target;
        const parentSection = button.closest(".editable-section");
        if (parentSection) {
            const saveButton = parentSection.querySelector(".save-button");
            const contentElement = parentSection.querySelector(".editable-content");
            if (saveButton && contentElement) {
                toggleEditSave(button, saveButton, contentElement);
            }
        }
    }
    if (target.classList.contains("save-button")) {
        const button = target;
        const parentSection = button.closest(".editable-section");
        if (parentSection) {
            const editButton = parentSection.querySelector(".edit-button");
            const contentElement = parentSection.querySelector(".editable-content");
            if (editButton && contentElement) {
                saveContent(button, editButton, contentElement);
            }
        }
    }
    if (target.id === "copy-link") {
        navigator.clipboard.writeText(resumeURLInput.value).then(() => {
            alert("Resume link copied to clipboard!");
        });
    }
    if (target.id === "download-resume") {
        downloadResumeAsPDF();
    }
});
