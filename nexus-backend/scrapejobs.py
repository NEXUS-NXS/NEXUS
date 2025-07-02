import json
import asyncio
from playwright.async_api import async_playwright
import os
from datetime import datetime

async def scrape_jobs():
    jobs = []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Scrape LinkedIn
        await page.goto("https://www.linkedin.com/jobs/search/?keywords=actuarial%20science&location=United%20States")
        await page.wait_for_selector(".jobs-search-results__list-item")
        job_elements = await page.query_selector_all(".jobs-search-results__list-item")
        for i, job in enumerate(job_elements[:5]):  # Limit to 5 jobs to stay lean
            title = await job.query_selector(".job-card-list__title")
            company = await job.query_selector(".job-card-container__company-name")
            location = await job.query_selector(".job-card-container__metadata-item")
            link = await job.query_selector(".job-card-list__title")
            jobs.append({
                "id": len(jobs) + 1,
                "title": await title.inner_text() if title else "Unknown",
                "company": await company.inner_text() if company else "Unknown",
                "location": await location.inner_text() if location else "Unknown",
                "link": await link.get_attribute("href") if link else "#"
            })

        # Scrape Indeed
        await page.goto("https://www.indeed.com/jobs?q=actuarial+science&l=United+States")
        await page.wait_for_selector(".jobTitle")
        job_elements = await page.query_selector_all(".result")
        for i, job in enumerate(job_elements[:5]):
            title = await job.query_selector(".jobTitle")
            company = await job.query_selector(".companyName")
            location = await job.query_selector(".companyLocation")
            link = await job.query_selector("a")
            jobs.append({
                "id": len(jobs) + 1,
                "title": await title.inner_text() if title else "Unknown",
                "company": await company.inner_text() if company else "Unknown",
                "location": await location.inner_text() if location else "Unknown",
                "link": f"https://www.indeed.com{await link.get_attribute('href')}" if link else "#"
            })

        # Scrape Glassdoor
        await page.goto("https://www.glassdoor.com/Job/actuarial-science-jobs-SRCH_KO0,16.htm")
        await page.wait_for_selector(".JobCard_jobTitle___7I5y")
        job_elements = await page.query_selector_all(".JobCard_jobCardContainer__lQ5x1")
        for i, job in enumerate(job_elements[:5]):
            title = await job.query_selector(".JobCard_jobTitle___7I5y")
            company = await job.query_selector(".JobCard_employerName__vm0W")
            location = await job.query_selector(".JobCard_location__N_iVq")
            link = await job.query_selector(".JobCard_jobCardContainer__lQ5x1 a")
            jobs.append({
                "id": len(jobs) + 1,
                "title": await title.inner_text() if title else "Unknown",
                "company": await company.inner_text() if company else "Unknown",
                "location": await location.inner_text() if location else "Unknown",
                "link": await link.get_attribute("href") if link else "#"
            })

        await browser.close()

    # Save to jobs.json
    with open("jobs.json", "w") as f:
        json.dump(jobs, f, indent=2)
    print(f"Saved {len(jobs)} jobs to jobs.json")

if __name__ == "__main__":
    asyncio.run(scrape_jobs())