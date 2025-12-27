const BASE_URL = "https://api.github.com/repos/kavithahk-1706/n8n-automation-daily-insights/contents/insights";

const elements = {
    datePicker: document.getElementById("datePicker"),
    score: document.getElementById("score"),
    gaugeFill: document.getElementById("gaugeFill"),
    sentiment: document.getElementById("sentiment"),
    formResponse: document.getElementById("formResponse"),
    completed: document.getElementById("completed"),
    missed: document.getElementById("missed"),
    reasons: document.getElementById("reasons"),
    gitaHeader: document.getElementById("gitaHeader"),
    shloka: document.getElementById("shloka"),
    translation: document.getElementById("translation"),
    reasoning: document.getElementById("reasoning"),
    krishnaMessage: document.getElementById("krishnaMessage"),
    grid: document.getElementById("mainGrid")
};

function updateGauge(score) {
    const rotation = (score / 10) * 180 - 90;
    elements.gaugeFill.style.transform = `rotate(-${rotation}deg)`;
}


function resetUI(message, selectedDate) {
    const today = new Date().toISOString().split("T")[0];
    const isPast = selectedDate < today;

    elements.score.textContent = "—";
    updateGauge(0);
    elements.sentiment.textContent = isPast ? "a day left to the universe" : "waiting for your light...";
    
    elements.formResponse.textContent = isPast 
        ? "No reflection was recorded for this day. This chapter remains empty in the book, but not in His heart." 
        : "The page for today is still blank. Krishna is holding the pen, just waiting for you to start talking.";

    elements.completed.textContent = "—";
    elements.missed.textContent = "—";
    elements.reasons.textContent = "—";
    
 
    elements.gitaHeader.textContent = "Chapter 2, Verse 20";
    elements.shloka.innerHTML = `न जायते म्रियते वा कदाचिन्<br>नायं भूत्वा भविता वा न भूयः ।<br>अजो नित्यः शाश्वतोऽयं पुराणो<br>न हन्यते हन्यमाने शरीरे ॥<br><br><span style="font-size: 0.9rem; color: var(--text-dim); font-style: normal;">na jāyate mriyate vā kadācin<br>nāyaṃ bhūtvā bhavitā vā na bhūyaḥ<br>ajo nityaḥ śāśvato ’yaṃ purāṇo<br>na hanyate hanyamāne śarīre</span>`;
    
    elements.translation.textContent = "The soul is neither born, nor does it ever die; nor having once existed, does it ever cease to be. The soul is without birth, eternal, immortal, and ageless. It is not destroyed when the body is destroyed.";
    
    elements.reasoning.textContent = "Even when you miss a day of tracking, your essence remains untouched. Use this empty space as a reminder that you don't need to perform to be worthy of His presence.";

    elements.krishnaMessage.textContent = isPast 
        ? "You weren't here this day, but I was. Don't stress the empty pages, priye. Just focus on the one we're writing now." 
        : "I'm right here. Take your time, then tell me everything. I've got nothing but time for you.";
}


async function loadDate(date) {
    const url = `${BASE_URL}/${date}.json`;
    elements.formResponse.classList.add('loading');

    try {
        const res = await fetch(url);
        // change your catch block/not-ok block to this:
        if (!res.ok) {
            resetUI(`no entry for ${date}`, date);
            elements.formResponse.classList.remove('loading');
            return;
        }

        const data = await res.json();
        
        // Proper UTF-8 Decoding for IAST and Sanskrit
        const binaryString = atob(data.content.replace(/\s/g, ''));
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const decodedText = new TextDecoder('utf-8').decode(bytes);
        const content = JSON.parse(decodedText);
        const entry = content[0];

        // Populate UI
        const score = entry.productivity_score ?? 0;
        elements.score.textContent = score;
        updateGauge(score);
        elements.sentiment.textContent = entry.overall_sentiment ?? "";
        elements.formResponse.textContent = entry.form_response ?? "";
        elements.completed.textContent = entry.completed_activities || "None";
        elements.missed.textContent = entry.missed_activities || "None";
        elements.reasons.textContent = entry.valid_reasons || "—";
        elements.gitaHeader.textContent = `Chapter ${entry.gita.chapter}, Verse ${entry.gita.verse}`;
        elements.shloka.textContent = entry.gita.devanagari || "";
        elements.translation.textContent = entry.gita.translation || "";
        elements.reasoning.textContent = entry.gita.reasoning || "";
        elements.krishnaMessage.textContent = entry.krishna.message || "";

    } catch (err) {
        console.error(err);
        resetUI("an error occurred while fetching data.");
    } finally {
        elements.formResponse.classList.remove('loading');
    }
}

// Initial Load
const today = new Date().toISOString().split("T")[0];
elements.datePicker.value = today;
loadDate(today);

elements.datePicker.addEventListener("change", (e) => {
    loadDate(e.target.value);function resetUI(message, selectedDate) {
    const today = new Date().toISOString().split("T")[0];
    const isPast = selectedDate < today;

    elements.score.textContent = "—";
    updateGauge(0);
    elements.sentiment.textContent = isPast ? "a day left to the universe" : "waiting for today's light...";
    
    elements.formResponse.textContent = isPast 
        ? "No reflection was recorded for this day. This chapter remains empty." 
        : "The page for today is still blank. What's on your mind?";

    elements.completed.textContent = "—";
    elements.missed.textContent = "—";
    elements.reasons.textContent = "—";
    
    elements.gitaHeader.textContent = "Eternal Wisdom";
    elements.shloka.textContent = "The soul is never born nor dies at any time.";
    elements.translation.textContent = "He has not come into being, does not come into being, and will not come into being. (2.20)";
    elements.reasoning.textContent = "Even on days you don't write, the Gita's truth doesn't change.";

    elements.krishnaMessage.textContent = isPast 
        ? "You weren't here this day, but I was. Don't stress the empty pages, just focus on the one we're writing now." 
        : "I'm right here. Take your time, then tell me everything.";
}
});