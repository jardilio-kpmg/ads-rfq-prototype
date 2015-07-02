FROM tomcat:latest
RUN rm -rvf /usr/local/tomcat/webapps/ROOT
RUN wget http://ec2-52-1-174-71.compute-1.amazonaws.com:8080/job/ads-rfq-prototype/203//artifact/bin/ads-rfq-prototype.war -O /usr/local/tomcat/webapps/ROOT.war
EXPOSE 8080
CMD ["catalina.sh", "run"]
