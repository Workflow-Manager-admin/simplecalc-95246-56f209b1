#!/bin/bash
cd /home/kavia/workspace/code-generation/simplecalc-95246-56f209b1/react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

