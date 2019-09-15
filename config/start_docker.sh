docker-compose -f ../docker-compose.yml up -d;
docker-compose -f ../packages/micro-auth/docker-compose.yml up -d;
docker-compose -f ../packages/micro-email/docker-compose.yml up -d;
docker-compose -f ../packages/eventstore/docker-compose.yml up -d;