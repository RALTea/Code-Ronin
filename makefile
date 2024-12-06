build-and-deploy:
	docker compose build --push
	ssh hostinger "cd /home/dockeruser/coderonin && docker compose pull && docker compose down && docker compose up -d"