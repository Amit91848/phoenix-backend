const e = require('express');
const puppeteer = require('puppeteer');

const scrapeKnowAFest = async () => {
	const browser = await puppeteer.launch({
		headless: true,
		executablePath:
			'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	});
	const page = await browser.newPage();

	await page.goto('https://www.knowafest.com/explore/fest-departments/CSE', {
		waitUntil: 'domcontentloaded',
	});

	const events = await page.$$('*[itemType="http://schema.org/Event"]');
	const eventDetails = [];

	const pageTarget = page.target();
	for (const event of events) {
		await event.evaluate((e) => e.click());
		const newTarget = await browser.waitForTarget(
			(target) => target.opener() === pageTarget
		);
		const newPage = await newTarget.page();
		try {
			const ext_link = await newPage.evaluate(
				() => document.location.href
			);
			let wholeTitle = await (
				await newPage.$('h3.mb-0')
			).evaluate((el) => el.textContent);

			let backgroundImage = await newPage.$eval('img.img-fluid', (el) =>
				el.getAttribute('src')
			);
			backgroundImage = backgroundImage.replace(/ /g, '%20');
			backgroundImage = 'www.knowafest.com' + backgroundImage;
			const rows = await newPage.$$('.col-lg-9 > .mb-7 > p');

			const details = await rows[0].evaluate((el) => el.textContent);

			// const details = await rows[1].evaluate((el) => el.textContent);

			// const guests = await rows[2].evaluate((el) => el.textContent);

			// const contact = await rows[3].evaluate((el) => el.textContent);

			const split = wholeTitle.split(',');

			const title = split[0];
			const location = split[split.length - 2];
			const date = split.pop();
			console.log(title);

			eventDetails.push({
				ext_link,
				logo: '',
				title,
				backgroundImage,
				details,
				date,
				location,
				type: 'college',
			});
		} catch (err) {}
		await newPage.close();
	}

	return eventDetails;

	// console.log(eventDetails);

	// await browser.close();
};

const scrape = async () => {
	const browser = await puppeteer.launch({
		headless: true,
		executablePath:
			'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	});
	const page = await browser.newPage();

	await page.goto('https://10times.com/india/technology', {
		waitUntil: 'domcontentloaded',
	});

	const events = await page.$$('.event-card');
	const eventsArr = [];

	for (const event of events) {
		try {
			const externalLink = await event.evaluate((el) =>
				el.querySelector('.show-related > h2 > a').getAttribute('href')
			);
			const logoImg = await event.evaluate((el) =>
				el
					.querySelector('.show-related > h2 > a > .end-0 > img')
					.getAttribute('src')
			);
			const title = await event.evaluate(
				(el) =>
					el.querySelector('.show-related > h2 > a > .d-block')
						.textContent
			);
			const details = await event.evaluate(
				(el) => el.childNodes.item(3).textContent
			);
			const date = await event.evaluate(
				(el) => el.childNodes.item(0).textContent
			);
			const location = await event.evaluate(
				(el) => el.childNodes.item(2).textContent
			);
			eventsArr.push({
				ext_link: externalLink,
				logo: logoImg,
				title: title,
				details,
				date: date,
				location: location,
				type: 'industrial',
			});
		} catch (err) {}
	}

	return eventsArr;
};

module.exports = { scrape, scrapeKnowAFest };
// const events = await page.$$eval('.event-card', (eventCards) =>
// 	eventCards.map((eventCard) => {
// 		const externalLink = eventCard
// 			.querySelector('.show-related > h2 > a')
// 			.getAttribute('href');
// 		const logoImg = eventCard
// 			.querySelector('.show-related > h2 > a > .end-0 > img')
// 			.getAttribute('src');
// 		const title = eventCard.querySelector(
// 			'.show-related > h2 > a > .d-block'
// 		).textContent;
// 		const details = eventCard.childNodes.item(3).textContent;
// 		const date = eventCard.childNodes.item(0).textContent;

// 		return {
// 			ext_link: externalLink,
// 			logo: logoImg,
// 			title: title,
// 			details: details,
// 			date: date,
// 		};
// 	})
// );
