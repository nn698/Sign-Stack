import cv2
import mediapipe as mp
import sys

# STEP A: Tell Python where your environment's files are (Must be FIRST)
sys.path.append(r'C:\Users\AKA\Documents\GitHub\Sign-Stack\vision\.venv\Lib\site-packages')

# STEP B: The Patch - We manually define 'solutions' BEFORE any other library loads
from mediapipe.python.solutions import hands as mp_hands
from mediapipe.python.solutions import drawing_utils as mp_draw

if not hasattr(mp, 'solutions'):
    class Solutions:
        pass
    mp.solutions = Solutions()
    mp.solutions.hands = mp_hands
    mp.solutions.drawing_utils = mp_draw

# STEP C: Now, and only now, we load CVZone
from cvzone.HandTrackingModule import HandDetector

# STEP D: Standard Logic
cap = cv2.VideoCapture(0)
detector = HandDetector(detectionCon=0.8, maxHands=2)

print("System Patched. Camera starting...")

while True:
    success, img = cap.read()
    if not success:
        break

    # This will now work because 'mp.solutions.hands' exists in memory
    hands, img = detector.findHands(img)

    cv2.imshow("Sign-Stack: The Final Fix", img)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()