const openSettingButton = document.getElementById("open-setting");
const closeSettingButton = document.getElementById("close-setting");
const settingPage = document.getElementById("setting-page");
const saveSettingButton = document.getElementById("save-setting");
const resetSettingButton = document.getElementById("reset-setting");
const resetHighestScoreButton = document.getElementById("reset-highest-score");

const settingConfig = {
  snakeSpeed: {
    settingName: "snakeSpeed",
    default: 100,
    options: [50, 100, 150],
    optionNames: {
      50: "慢",
      100: "中",
      150: "快",
    },
    inputId: "speed",
    inputType: "select",
  },
  allowHitWalls: {
    settingName: "allowHitWalls",
    default: "true",
    options: ["true", "false"],
    inputId: "wall",
    inputType: "checkbox",
  },
};

function convertToDataTypeOf(dataOfTargetType, input) {
  let targetType = typeof dataOfTargetType;
  let convertedInput;
  if (!input) {
    return dataOfTargetType;
  }
  if (targetType === "number") {
    convertedInput = Number(input);
  } else if (targetType === "string") {
    convertedInput = input.toString();
  } else {
    return dataOfTargetType;
  }
  return convertedInput;
}

function loadSettings() {
  let loadedSettings = {};
  for (let setting in settingConfig) {
    const {
      settingName,
      default: defaultValue,
      options,
      inputId,
      inputType,
    } = settingConfig[setting];
    let settingValue = localStorage.getItem(settingName);
    settingValue =
      settingValue && convertToDataTypeOf(defaultValue, settingValue);
    if (!options.includes(settingValue)) {
      localStorage.setItem(settingName, defaultValue);
      settingValue = defaultValue;
    }
    loadedSettings[settingName] = settingValue;

    if (inputType === "select") {
      let select = document.getElementById(inputId);
      for (let option of options) {
        let selectOption = document.createElement("option");
        selectOption.value = option;
        selectOption.selected = option === settingValue;
        selectOption.textContent =
          settingConfig[setting]["optionNames"][option];
        select.appendChild(selectOption);
      }
    } else if (inputType === "checkbox") {
      let input = document.getElementById(inputId);
      input.checked = settingValue == "true";
    }
  }
  return loadedSettings;
}

function saveSettings() {
  for (let setting in settingConfig) {
    console.log(setting);
    const {
      settingName,
      inputId,
      inputType,
      options,
      default: defaultValue,
    } = settingConfig[setting];
    let settingValue;
    if (inputType === "checkbox") {
      settingValue = document.getElementById(inputId).checked.toString();
    } else {
      settingValue = document.getElementById(inputId).value;
    }
    settingValue = convertToDataTypeOf(defaultValue, settingValue);
    if (!options.includes(settingValue)) {
      console.log(options, settingValue);
      localStorage.setItem(settingName, defaultValue);
      settingValue = defaultValue;
    } else {
      console.log("儲存設定值: " + settingValue);
      localStorage.setItem(settingName, settingValue);
    }
  }
}

function resetSettings() {
  for (let setting in settingConfig) {
    const {
      settingName,
      default: defaultValue,
      inputId,
      inputType,
    } = settingConfig[setting];
    localStorage.setItem(settingName, defaultValue);
    if (inputType === "checkbox") {
      document.getElementById(inputId).checked = defaultValue == "true";
    } else {
      document.getElementById(inputId).value = defaultValue;
    }
  }
}

function removePageAnimation(event) {
  settingPage.style.animation = "";
  if (event.animationName === "fade-out") {
    settingPage.classList.remove("page-cover");
  }
}

settingPage.addEventListener("animationend", removePageAnimation);

function openPage() {
  settingPage.style.animation = "fade-in 0.1s linear";
  settingPage.classList.add("page-cover");
}

function closePage() {
  settingPage.style.animation = "fade-out 0.1s linear";
}

openSettingButton.addEventListener("click", () => {
  console.log("開啟設定頁面");
  openPage();
});

closeSettingButton.addEventListener("click", () => {
  console.log("關閉設定頁面");
  closePage();
});

saveSettingButton.addEventListener("click", () => {
  console.log("儲存設定");

  saveSettings();

  closePage();
});

resetSettingButton.addEventListener("click", () => {
  console.log("重置設定");
  resetSettings();
  closePage();
  location.reload();
});

resetHighestScoreButton.addEventListener("click", () => {
  document.getElementById("highest-score").innerHTML = "最高分數: " + 0;
  localStorage.setItem("highestScore", 0);
  closePage();
  location.reload();
});

let loadedSettings = loadSettings();
