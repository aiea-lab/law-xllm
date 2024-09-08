from pathlib import Path
from urllib.parse import urljoin


import scrapy


class QuotesSpider(scrapy.Spider):
    name = "self_help_court_info"
    links = set()

    valid_urls = ['https://selfhelp.courts.ca.gov/parentage',
                  'https://selfhelp.courts.ca.gov/child-custody',
                  'https://selfhelp.courts.ca.gov/divorce-california',
                  'https://selfhelp.courts.ca.gov/divorce',
                  'https://selfhelp.courts.ca.gov/child-support',
                  'https://selfhelp.courts.ca.gov/DV-restraining-order',
                  'https://selfhelp.courts.ca.gov/guardianship'
                  ]

    def start_requests(self):
        urls = [
            "https://selfhelp.courts.ca.gov/families-and-children",
        ]
        
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)
            
    def parse(self, response):
        # Extract all links from the page
        links = response.css('a::attr(href)').getall()
        
       
        for link in links:
            # Join relative URLs with the base URL
            full_url = urljoin(response.url, link)
            
            # Validate URL
            if self.valid_url(full_url):
                self.links.add(full_url)
                self.log(f"Saved link: {full_url}")

                if not full_url.endswith('.html') and not full_url.endswith('.pdf'):
                    yield scrapy.Request(url=full_url, callback=self.parse)

            else:
                self.log(f"Invalid URL: {full_url}")

        # Print the number of valid links
        print(f"Number of valid links: {sum(1 for link in links if self.valid_url(urljoin(response.url, link)))}")


    def valid_url(self, url):
        # Check if the URL ends with .pdf or .html and is within the specified domain
        for valid_url in self.valid_urls:
            if url.startswith(valid_url):
                return True
        return False
    
    def closed(self, reason):
        # Write all accumulated links to the file once the spider is done
        with open('filtered_links.txt', 'w') as f:
            for link in self.links:
                f.write(f"{link}\n")
        self.log(f"Saved {len(self.links)} links to filtered_links.txt")

    # def parse(self, response):
    #     page = response.url.split("/")[-2]
    #     filename = f"quotes-{page}.html"
    #     Path(filename).write_bytes(response.body)
    #     self.log(f"Saved file {filename}")
