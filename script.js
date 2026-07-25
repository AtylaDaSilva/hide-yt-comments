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

function main() {
    const commSection = document.querySelector("#comments");
    const comments = commSection.querySelector("#sections");
    comments.style.display = 'none';

    // Avoid adding a duplicate button on repeated calls
    if (commSection.querySelector("#show-comments-btn")) {
        return;
    }

    const btn = document.createElement("button");
    btn.id = "show-comments-btn";
    btn.textContent = "Show/Hide comments";

    btn.style.fontFamily = '"Roboto", "Arial", sans-serif';
    btn.style.fontSize = "14px";
    btn.style.fontWeight = "500";
    btn.style.color = "var(--yt-spec-text-primary, #0f0f0f)";
    btn.style.backgroundColor = "var(--yt-spec-badge-chip-background, #f2f2f2)";
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
        btn.style.backgroundColor = "var(--yt-spec-badge-chip-background-hover, #e5e5e5)";
    });
    btn.addEventListener("mouseleave", () => {
        btn.style.backgroundColor = "var(--yt-spec-badge-chip-background, #f2f2f2)";
    });

    btn.addEventListener("click", () => {
        const comments = document.querySelector("#comments #sections")
        comments.style.display = (comments.style.display === 'none') ? "block" : "none"
    });

    commSection.prepend(btn);
}

retryOnException(main, 300, 1)
.then(() => {
    console.log("HIDE-YT-COMMENTS: Comments section hidden.")
})
.catch(err => {
    console.error("HIDE-YT-COMMENTS: Unexpected error ", err);
})