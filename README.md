| Name | URL |
| ------------- | ------------- |
| Application|http://ec2-52-1-174-71.compute-1.amazonaws.com:8888/origin/master/ |
| Application (Docker Container) | http://ec2-52-1-174-71.compute-1.amazonaws.com/ |
| Jenksins CI | http://ec2-52-1-174-71.compute-1.amazonaws.com:8080/ |
| Build Artifacts (master release) | http://ec2-52-1-174-71.compute-1.amazonaws.com:8080/job/ads-rfq-prototype/201/ |
| Documentation (master release) | http://ec2-52-1-174-71.compute-1.amazonaws.com:8080/job/ads-rfq-prototype/201/javadoc/ |
| Test Results (master release) | http://ec2-52-1-174-71.compute-1.amazonaws.com:8080/job/ads-rfq-prototype/201/testReport/ |
| Code Coverage Reports (master release) | http://ec2-52-1-174-71.compute-1.amazonaws.com:8080/job/ads-rfq-prototype/201/cobertura/ |
| Setup Instructions | https://github.com/jardilio-kpmg/ads-rfq-prototype/blob/master/INSTRUCTIONS.md |

#Cover Letter
July 1, 2015

Hassan Harris
Senior Contracting Officer
National IT Commodity Program
820 W. Peachtree Street Suite 820
Atlanta, GA 30308
(404) 215-8705
hassan.harris@gsa.gov

Re: Request for Quote (RFQ) #4QTFHG150004

Dear Mr. Harris:
KPMG LLP (KPMG) is pleased to submit our proposal for the establishment of a Multiple Award Blanket Purchase Agreement (BPA) for Agile Delivery Services (ADS 1). KPMG has demonstrated our technical skills and capabilities to support GSA since 2006, including support on the IT Schedule 70 Contract. KPMG provides business and technology services throughout the federal government, and our user and business centered approach makes us well suited to support GSA on the ADS 1 contract.  KPMG has been named a worldwide leader in Digital Enterprise Strategy Consulting by IDC MarketScape, and a Leader in Mobile Enterprise App Services Providers for employee and partner-facing mobile enterprise applications by Forrester.

##Assumptions
The ADS 1 Assumptions are:
* Prior to finalizing a contract and subsequent task orders, KPMG will have an opportunity to state specific assumptions for the BPA and each task order.  
* Our proposal is valid for 120 days from the date of proposal submission, but can be extended at the government�s request.

##Other Matters
KPMG LLP has a contract to audit GSA�s financial statements which requires KPMG to obtain that Contracting Officer�s (CO) approval for KPMG to perform other work for, or enter into other contracts with GSA.  In the past, KPMG has received such approval, including, for example, on government-wide contracts like IT-70.  KPMG has requested expedited approval from the audit CO to perform this contract, but due to the timeline of the ADS 1 solicitation, we have not yet heard from the CO.  Our proposal is contingent upon receiving that approval. We will notify you of our audit CO�s decision when received.  
On behalf of KPMG, I want to express our enthusiasm for the opportunity to expand our support to GSA. Acceptance of this contract is contingent upon the successful completion of our standard engagement acceptance process. If you have any questions or need clarification on any of the points in our proposal, please contact Robert Dwyer at 703-286-8590 or 703-861-8778 or [rmdwyer@kpmg.com] (mailto: rmdwyer@kpmg.com)

Sincerely,
KPMG LLP
Robert M. Dwyer
Managing Director


#Prototype Approach
KPMG mobilized a team including participants who could serve as proxies for end-users, government customers and stakeholders.  Our team consisted of members from our DC-based Federal Advisory practice including members with relevant project experience at FDA, application and user experience designers, and developers from one of our state-of-the-art Ignition Centers in the U.S., where teams are regularly delivering Digital and Mobile innovation services.  The Product Manager was identified to own our effort centered on OpenFDA�s dataset and API for the [food enforcement reports] (https://open.fda.gov/food/enforcement/).

Mobilization continued with a meeting with a KPMG Agile Coach and review of the U.S. Digital Services Playbook. Our team familiarized themselves with the data available via OpenFDA. In accordance with our standard Agile delivery practices, we had end-users and technical members of the team observing and participating in those data familiarization sessions.  
Based on time constraints, the team proceeded with an abbreviated version of [KPMG's Motivational Design Approach] (https://github.com/jardilio-kpmg/ads-rfq-prototype/blob/master/cover_letter_attachments/KPMG_Digital_Approach_Overview.pdf) that includes elements of behavioral research and modeling, customer journeys, and behavior maps. Joint ideation sessions were held to produce [user stories] (https://github.com/jardilio-kpmg/ads-rfq-prototype/labels/user%20story) and organize them into a Product Backlog.  The team worked the nuances of the OpenFDA dataset and API to groom the backlog and add the appropriate sizing estimates for each of the tasks which were prioritized into Sprints. Example features like �search by area� or �look-up recalls by GPS location� that were proposed by users and discussed were given a lower priority based on the analysis of the data returned by the OpenFDA food enforcement reports API which contained non-uniform, incomplete geographic location information. The Product Manager evaluated the estimates, timelines and priorities to determine that the first Sprint would be to scan a barcode to produce a list of associated recalls. We focused on the user story where a consumer uses a mobile device to quickly verify if a product is on the recall list.

In parallel with ideation, the Delivery Manager tasked the DevOps Engineer to spin up an Amazon Web Services (AWS) EC2 instance for the prototype. A publicly-accessible GitHub repository for source code and release management was selected instead of KPMG�s integrated Atlassian suite of tools to avoid RFQ compliance issues. The [Jenkins Continuous Integration] (http://ec2-52-1-174-71.compute-1.amazonaws.com:8080/view/All/job/ads-rfq-prototype/) server and necessary tools were installed on the AWS instance for the technical team to collaborate and make use of KPMG�s library of accelerators for design, development, and configuration management.  

The effort continued with Protosketching including screen mocks and other aspects of [user interface design] (https://github.com/jardilio-kpmg/ads-rfq-prototype/blob/master/cover_letter_attachments/designs). Since no specific style guide was prescribed, the team selected [Google Material Design] (http://www.google.com/design/spec/material-design/introduction.html) to expedite delivery of the prototype. The Visual Designer iterated through the mockups and design assets and these have been placed in the GitHub repository. Tasks were assigned and the development resources began building the application as completed design assets became available. The team decided to name the application as 'SAFER (Search & Analyze Food Enforcement Reports)'.

Each developer was responsible for the successful completion of their local unit tests, prior to committing artifacts to their own Branch to push to GitHub. The commit to GitHub automatically kicked-off a Jenkins build and deployment for that branch. Once the developer was satisfied with their build, they submitted a pull request for the DevOps engineer to review. The DevOps engineer reviewed all pull requests for the Sprint and conferred with the Product Manager to merge the pull requests into the Master Branch for the Sprint demo.  Protractor was used to conduct end-to-end tests of the Sprint demo.  

After validating the system test, the Product Manager then engaged the users and stakeholders to access the prototype and provide feedback.  The users were surveyed, [feedback collected] (https://github.com/jardilio-kpmg/ads-rfq-prototype/blob/master/cover_letter_attachments/feedback), appropriate [issues] (https://github.com/jardilio-kpmg/ads-rfq-prototype/issues?utf8=%E2%9C%93&q=is%3Aissue) created in GitHub, and triaged for impact to Product Backlog. For one of the feedback sessions, we captured [photographs] (https://github.com/jardilio-kpmg/ads-rfq-prototype/blob/master/cover_letter_attachments/feedback) of the users as well as took [screenshots] (https://github.com/jardilio-kpmg/ads-rfq-prototype/blob/master/cover_letter_attachments/collaboration) of the Confluence collaboration site used to capture the feedback � these artifacts are in the GitHub repository.

The Product Manager then rapidly determined factors that needed to be incorporated into subsequent Sprints, specifically the need for manual entry of keyword-based searches to overcome reliability challenges encountered with taking pictures of product UPC barcodes. Also, based on the observed lack of UPC data in the OpenFDA foods enforcement reports, the Product Manager determined more complete results could be attained by using keywords from UPC code lookups prior to submitting the query to OpenFDA and added the feature to the Product Backlog. A selection of readily available services was quickly evaluated and we selected an API from [Factual] (http://developer.factual.com/working-with-factual-products/) that provided UPC lookup and imaging data for food products.

The Delivery Manager facilitated daily scrums with the Product Manager and Development resources for the feedback impacting the Sprint. The team followed the configuration management, communication and feedback process as outlined above for each daily Sprint. 

On notification of the submission deadline push to July 1, the Product Manager decided not to change scope and complete the release as per the planned features. On subsequent notification of a deadline push to July 7, the Product Manager decided to utilize the time to get additional user feedback on the released features and focus on issue resolution and clean-up. 

The GitHub repository final end-to-end tests were conducted to validate the prototype release candidate. The DevOps Engineer tagged the release of the build in GitHub. Based on the additional time, the Product Manager reviewed the remaining open issues in GitHub, selected user stories and groomed the Product backlog in preparation for future Sprints. The Product Manager confirmed all artifacts in the GitHub repository and prepared the response to be submitted in eBuy.
