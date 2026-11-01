#!/usr/bin/env python3
"""Build + tüm testler tek komutla."""
import os, subprocess, sys
k = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
subprocess.check_call([sys.executable, os.path.join(k, "build.py")])
sys.exit(subprocess.call([sys.executable, os.path.join(k, "tests", "run_tests.py")]))
