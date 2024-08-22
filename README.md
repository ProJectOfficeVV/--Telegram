# BB-Telegram
Hello VVLegalBot

## Docker
sudo docker compose up -d

## Test Flask
sudo kill -9 $(sudo lsof -t -i:9091) && python3 server.py

## Yandex Docker (px to be changed to your user name)
curl -sSL https://storage.yandexcloud.net/yandexcloud-yc/install.sh | bash
echo 'source /home/px/yandex-cloud/completion.zsh.inc' >>  ~/.zshrc
source "/home/px/.bashrc"

-------------
GET OAUTH TOKEN
https://yandex.cloud/ru/docs/container-registry/operations/authentication#user-oauth

y0_************************-KQ

echo y0_************************-KQ | docker login \
  --username oauth \
  --password-stdin \
  cr.yandex

https://yandex.cloud/ru/docs/compute/operations/vm-connect/ssh#creating-ssh-keys
ssh-keygen -t ed25519
OUTPUT IS LOCATED AT ~/.ssh/id_ed25519.pub

yc compute instance create-with-container \
  --name my-vm \
  --zone ru-central1-a \
  --ssh-key ~/.ssh/id_ed25519.pub \
  --create-boot-disk size=30 \
  --network-interface subnet-name=default-ru-central1-a,nat-ip-version=ipv4 \
  --service-account-name service-acc \
  --docker-compose-file compose.yaml
nan
https://yandex.cloud/ru/docs/compute/operations/vm-connect/ssh
ALLOW OS LOGIN IN INSTANCE EDIT
yc compute ssh --name my-vm --folder-id ******

git clone https://github.com/steven-kollo/BB-Telegram.git

nano compose.yaml -> edit lines
    - GROUP_ID="*******"
    - TOKEN="*******"
    - URL="0.0.0.0"

sudo docker compose up -d