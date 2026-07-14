Remove-Item -Recurse -Force src/project -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force src/report -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force src/ai-evaluation -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force src/task-engine -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force src/gamification -ErrorAction SilentlyContinue

npx nest g module mentor
npx nest g controller mentor --no-spec
npx nest g service mentor --no-spec

npx nest g module admin
npx nest g controller admin --no-spec
npx nest g service admin --no-spec

npx nest g module internship
npx nest g controller internship --no-spec
npx nest g service internship --no-spec

npx nest g module roadmap
npx nest g controller roadmap --no-spec
npx nest g service roadmap --no-spec

npx nest g module task
npx nest g controller task --no-spec
npx nest g service task --no-spec

npx nest g module submission
npx nest g controller submission --no-spec
npx nest g service submission --no-spec

npx nest g module ai
npx nest g controller ai --no-spec
npx nest g service ai --no-spec

npx nest g module leaderboard
npx nest g controller leaderboard --no-spec
npx nest g service leaderboard --no-spec

npm install @nestjs/event-emitter
