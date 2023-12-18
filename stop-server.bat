@echo off
cd cip*
cd back*
pm2 stop src/index.js
