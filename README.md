# CouponSystem.web
<a>RESTful WEB services for the coupzone Core.</a>

Hosts Single Page Applications for multiple Users types:
Company - a company which can publish Coupons for buyers, with photos and dypes, it can also manage the whole details of the Coupons.
Customer - a potential buyer of Coupons, can buy published Coupons which were published by Companies.
Admin - can manage registretion of the above 2 types of user.

Single HomePages application Links:
for admin users:

http://localhost:8080/CouponSystem.web/IndexAD.html

for company users:

http://localhost:8080/CouponSystem.web/IndexCO.html

for customer users:

http://localhost:8080/CouponSystem.web/IndexCU.html

* Used: RESTFul, Derby DB, Apache Tomcan Web Server/Widfly App Server, Angular (JAvaScript) , ClassBoost (css).

For Usage, a Derby DB Server is needs to be executed and created with the needed DB Tables.
Example of possible registered system users:
Admin users:
username     password
admin        1234

Company users:  
username     password
nirvana      12345
chilout      chilout
brownie      cook

Customer users:
username     password
FirstUser    12345
secUser      54321
bestCustomer lol
