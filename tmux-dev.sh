#!/bin/sh
tmux new-session -d -s 'unconference'
tmux split-window -h
tmux split-window -h
tmux split-window -h
tmux select-layout tiled
tmux send-keys -t 0 C-z 'yarn serve' Enter
tmux send-keys -t 1 C-z 'yarn emulators' Enter
tmux send-keys -t 2 C-z 'yarn test:emulate' Enter
tmux select-pane -t 3
tmux -2 attach-session -d