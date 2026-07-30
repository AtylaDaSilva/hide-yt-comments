function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryOnException(
    func,
    maxAttempts = 1,
    pollingSeconds = 1,
) {
    if (maxAttempts < 1) {
        throw new Error(`maxAttempts must be >= 1, got ${maxAttempts}`)
    }

    for (let i = 1; i <= maxAttempts; i ++) {
        try{
            return func()
        } catch (err) {
            if (i === maxAttempts) {
                throw err;
            }
            if (pollingSeconds) {
                await sleep(pollingSeconds * 1000)
            }
        }
    }
}

function render_mobile_btn() {
    const btn = document.createElement("button");
    btn.id = "show-comments-btn";
    btn.textContent = "Show/Hide comments";

    btn.style.fontFamily = '"Roboto", "Arial", sans-serif';
    btn.style.fontSize = "12px";
    btn.style.fontWeight = "500";
    btn.style.letterSpacing = "0.5px";
    btn.style.color = "#f1f1f1";
    btn.style.backgroundColor = "rgba(255,255,255,0.1)";
    btn.style.border = "none";
    btn.style.borderRadius = "16px";
    btn.style.padding = "0 12px";
    btn.style.height = "32px";
    btn.style.lineHeight = "32px";
    btn.style.cursor = "pointer";
    btn.style.display = "block";
    btn.style.width = "fit-content";
    btn.style.margin = "8px auto 20px auto";

    btn.style.transition = "transform 0.1s ease, background-color 0.15s ease";

    const press = () => {
        btn.style.transform = "scale(0.95)";
        btn.style.backgroundColor = "rgba(255,255,255,0.2)";
    };
    const release = () => {
        btn.style.transform = "scale(1)";
        btn.style.backgroundColor = "rgba(255,255,255,0.1)";
    };

    btn.addEventListener("mousedown", press);
    btn.addEventListener("mouseup", release);
    btn.addEventListener("mouseleave", release); // in case the cursor drags off while pressed

    btn.addEventListener("touchstart", press, { passive: true });
    btn.addEventListener("touchend", release);
    btn.addEventListener("touchcancel", release); // in case the touch is interrupted (e.g. scroll, call)

    btn.addEventListener("click", () => {
        const comments = document.querySelector(".ytVideoMetadataCarouselViewModelHost")
        comments.style.display = (comments.style.display === 'none') ? "block" : "none"
    });
    return btn;
}

function render_desktop_btn() {
    const btn = document.createElement("button");
    btn.id = "show-comments-btn";
    btn.textContent = "Show/Hide comments";

    btn.style.fontFamily = '"Roboto", "Arial", sans-serif';
    btn.style.fontSize = "14px";
    btn.style.fontWeight = "500";
    btn.style.color = "#f1f1f1";
    btn.style.backgroundColor = "rgba(255,255,255,0.1)";
    btn.style.border = "none";
    btn.style.borderRadius = "18px";
    btn.style.padding = "0 16px";
    btn.style.height = "36px";
    btn.style.lineHeight = "36px";
    btn.style.cursor = "pointer";
    btn.style.display = "block";
    btn.style.width = "fit-content";
    btn.style.margin = "12px auto";

    btn.style.transition = "transform 0.1s ease, background-color 0.15s ease";

    btn.addEventListener("mousedown", () => {
        btn.style.transform = "scale(0.95)";
    });
    btn.addEventListener("mouseup", () => {
        btn.style.transform = "scale(1)";
    });
    btn.addEventListener("mouseleave", () => {
        btn.style.transform = "scale(1)"; // in case the cursor drags off while pressed
    });

    btn.addEventListener("mouseenter", () => {
        btn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    });
    btn.addEventListener("mouseleave", () => {
        btn.style.backgroundColor = "rgba(255,255,255,0.1)";
    });

    btn.addEventListener("click", () => {
        const comments = document.querySelector("#comments #sections")
        comments.style.display = (comments.style.display === 'none') ? "block" : "none"
    });
    return btn;
}

function run_desktop_logic() {
    console.log("HIDE-YT-COMMENTS: Running desktop logic...")
    const commSection = document.querySelector("#comments");
    const comments = commSection.querySelector("#sections");
    comments.style.display = 'none';

    // Avoid adding a duplicate button on repeated calls
    if (commSection.querySelector("#show-comments-btn")) {
        return;
    }

    const btn = render_desktop_btn()

    commSection.prepend(btn);
}

function run_mobile_logic() {
    console.log("HIDE-YT-COMMENTS: Running mobile logic...")
    const commSectionContainer = document.querySelector(".ytVideoMetadataCarouselViewModelHost")
    const commSection = document.querySelector(".ytCommentTeaserCarouselItemViewModelHost");
    const comments = commSection.querySelectorAll(".ytCommentsEntryPointTeaserViewModelHost");
    commSectionContainer.style.display = 'none';

    // Avoid adding a duplicate button on repeated calls
    if (commSection.querySelector("#show-comments-btn")) {
        return;
    }

    const btn = render_mobile_btn();

    commSectionContainer.parentElement.prepend(btn);
}

function main() {
    console.log("HIDE-YT-COMMENTS: Hiding comments section...");
    url = window.location.hostname.toLowerCase();
    const mobileUrl = "m.youtube.com";
    const desktopUrl = "www.youtube.com";
    switch (url) {
        case mobileUrl:
            run_mobile_logic();
            break;
        case desktopUrl:
            run_desktop_logic();
            break;
        default:
            throw new Error(`Invalid URL. Expected [${mobileUrl}, ${desktopUrl}], got: '${url}'`);
            break;
    }
}

retryOnException(main, 300, 1)
.then(() => {
    console.log("HIDE-YT-COMMENTS: Comments section hidden.")
})
.catch(err => {
    console.error("HIDE-YT-COMMENTS: Unexpected error ", err);
})