const healthAdvices = [
    {
        title: "𝗗𝗼𝗻’𝘁 𝗟𝗲𝘁 𝗕𝗮𝗰𝘁𝗲𝗿𝗶𝗮 𝗢𝘂𝘁𝘀𝗺𝗮𝗿𝘁 𝗨𝘀!",
        description: "𝗧𝗮𝗸𝗶𝗻𝗴 𝗮𝗻𝘁𝗶𝗯𝗶𝗼𝘁𝗶𝗰𝘀 𝘁𝗵𝗲 𝘄𝗿𝗼𝗻𝗴 𝘄𝗮𝘆 𝗹𝗶𝗸𝗲 𝘀𝗸𝗶𝗽𝗽𝗶𝗻𝗴 𝗱𝗼𝘀𝗲𝘀, 𝘀𝘁𝗼𝗽𝗽𝗶𝗻𝗴 𝘁𝗼𝗼 𝗲𝗮𝗿𝗹𝘆, 𝗼𝗿 𝘂𝘀𝗶𝗻𝗴 𝘁𝗵𝗲𝗺 𝘄𝗶𝘁𝗵𝗼𝘂𝘁 𝗮 𝗱𝗼𝗰𝘁𝗼𝗿’𝘀 𝗮𝗱𝘃𝗶𝗰𝗲 𝗴𝗶𝘃𝗲𝘀 𝗯𝗮𝗰𝘁𝗲𝗿𝗶𝗮 𝗮 𝗰𝗵𝗮𝗻𝗰𝗲 𝘁𝗼 𝗳𝗶𝗴𝗵𝘁 𝗯𝗮𝗰𝗸 𝗮𝗻𝗱 𝗯𝗲𝗰𝗼𝗺𝗲 𝗿𝗲𝘀𝗶𝘀𝘁𝗮𝗻𝘁",
        fbLink: "https://web.facebook.com/UDMClinic1995/posts/pfbid035dfjQKCbLX7DdXsKLRza4zR3E9L5pd5mJgq4nPK2fZr2mXjenprbJPB6JZxK7qygl"
    }
];

const container = document.getElementById('education-container');

healthAdvices.forEach(advice => {
    const card = document.createElement('div');
    card.className = 'education-card';

    const title = document.createElement('h3');
    title.textContent = advice.title;

    const desc = document.createElement('p');
    desc.textContent = advice.description;

    const link = document.createElement('a');
    link.href = advice.fbLink;
    link.target = "_blank";
    link.textContent = "Read more on Facebook";

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(link);

    container.appendChild(card);
});
