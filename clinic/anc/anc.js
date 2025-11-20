const announcements = [
    {
        title: "Clinic Hours Update",
        description: "Starting November 25, our clinic will operate from 8:00 AM to 5:00 PM on weekdays. Please plan your appointments accordingly.",
        date: "2025-11-20"
    },
    {
        title: "Flu Vaccination Drive",
        description: "We are hosting a flu vaccination drive for students. Available slots are limited, so please book your schedule early!",
        date: "2025-11-18"
    },
    {
        title: "New Health Guidelines",
        description: "Please follow our updated health protocols when visiting the clinic, including wearing masks and proper hand sanitation.",
        date: "2025-11-15"
    }
];

const container = document.getElementById('announcement-container');

announcements.forEach(ann => {
    const box = document.createElement('div');
    box.className = 'announcement-box';

    const title = document.createElement('h3');
    title.textContent = ann.title;

    const desc = document.createElement('p');
    desc.textContent = ann.description;

    const date = document.createElement('span');
    date.className = 'date';
    date.textContent = ann.date;

    box.appendChild(title);
    box.appendChild(desc);
    box.appendChild(date);

    container.appendChild(box);
});
