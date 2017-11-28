from skimage.segmentation import slic
from skimage.segmentation import mark_boundaries
from skimage.util import img_as_uint
import matplotlib.pyplot as plt
import numpy as np
np.set_printoptions(threshold=np.nan)
import argparse
import cv2, glob, os, codecs, json


# construct the argument parser and parse the arguments
# ap = argparse.ArgumentParser()
# ap.add_argument('-i', '--image', required = True, help = 'Path to image')
# args = vars(ap.parse_args())

IMAGES_DIR = 'images/*jpg'
SEGMENT_COLOR = 255

for img in glob.glob(IMAGES_DIR):
    img_name, _ = os.path.splitext(img)
    # load the image and apply SLIC and extract (approximately) the supplied number of segments
    # image = cv2.imread(args['image'])
    image = cv2.imread(img)
    height, width, channels = image.shape
    segments = slic(img_as_uint(image), n_segments = 200,  sigma= 2)

    # show the output of SLIC
    # fig = plt.figure('Superpixels')
    # ax = fig.add_subplot(1, 1, 1)
    # ax.imshow(mark_boundaries(img_as_float(cv2.cvtColor(image, cv2.COLOR_BGR2RGB)), segments))
    # plt.axis('off')
    # plt.show()
    # plt.savefig('{}_annotated.jpg'.format(img_name))

    annotated_img = mark_boundaries(image, segments, color=(255, 255, 255)) * 255
    cv2.imwrite('{}_annotated.jpg'.format(img_name), annotated_img)
    annotated_img[np.where((annotated_img <= 255).all(axis=2))] = 0
    cv2.imwrite('{}_annotated_boundry.png'.format(img_name), annotated_img)

    # remove black background
    src = cv2.imread('{}_annotated_boundry.png'.format(img_name), 1)
    tmp = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)
    _, alpha = cv2.threshold(tmp, 0, 255, cv2.THRESH_BINARY)
    b, g, r = cv2.split(src)
    rgba = [b, g, r, alpha]
    dst = cv2.merge(rgba, 4)
    cv2.imwrite('{}_annotated_boundry.png'.format(img_name), dst)

    img_dic = {}
    # loop over the unique segment values
    for (i, segVal) in enumerate(np.unique(annotated_img)):
        # construct a mask for the segment
        # print 'segment {} value:\n{}'.format(i, annotated_img)
        img_dic['segment_{}'.format(i)] = annotated_img.tolist()
        # try:
        #     SEGMENT_COLOR = int(input('Segment Val:'))
        #     pass
        # except ValueError:
        #     print 'Not a number'
        # mask = np.zeros(image.shape[:2], dtype='uint8')
        # mask[segments == segVal] = SEGMENT_COLOR
        # show the masked region
        # cv2.imshow('Mask', mask)
        # cv2.imshow('Applied', cv2.bitwise_and(image, image, mask=mask))
        # cv2.waitKey(0)

    with open('{}_RGB.json'.format(img_name), 'w') as fp:
        json.dump(img_dic, fp)
    # print img_dic


