import cv2
import mediapipe as mp

# HEALTH CHECK: This will tell us if MediaPipe is actually fixed
try:
    from mediapipe.python.solutions import hands as mp_hands
    print("✅ MediaPipe is healthy!")
except Exception as e:
    print(f"❌ MediaPipe is still broken: {e}")

from cvzone.HandTrackingModule import HandDetector

cap = cv2.VideoCapture(0)
detector = HandDetector(detectionCon=0.8, maxHands=2)

while True:
    success, img = cap.read()
    if not success:
        break

    # The moment of truth
    hands, img = detector.findHands(img)

    cv2.imshow("Sign-Stack: Finally Working", img)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()