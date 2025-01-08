#!/bin/bash
ssh hostinger "cd /data/coolify/applications/gss8ckgckg0oo0wg40cgs8cg && echo \"$(docker compose ps --services --filter status=running)\" && echo \"done\""
#ssh hostinger "cd /data/coolify/applications/gss8ckgckg0oo0wg40cgs8cg && docker compose cp $(docker compose ps --services --filter \"status=running\"):/app/prisma/dev.db ./backup.db"
