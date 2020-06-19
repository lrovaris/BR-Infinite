rm -v build.tar.gz

tar --exclude='./node_modules' --exclude='./deploy.sh' --exclude='./uploads' --exclude='./relatorios' --exclude='./coverage' -zcvf build.tar.gz ./*

sshpass -p "$eg#Grana2020" scp -P22022 build.tar.gz root@162.214.89.17:/home/sistemabr/back-end/

sshpass -p "$eg#Grana2020" ssh -p 22022 root@162.214.89.17 'tar -zxvf /home/sistemabr/back-end/build.tar.gz'

sshpass -p "$eg#Grana2020" ssh -p 22022 root@162.214.89.17 'rm -v /home/sistemabr/back-end/build.tar.gz'
