package utils

import (
	"fmt"
	"math/rand"

	"github.com/SYSU-ECNC/shift-scheduler/backend/internal/domain"
)

var usernames []string = []string{
	"Acey", "Brio", "Cyra", "Dray", "Elva",
	"Flyn", "Gira", "Hilo", "Ilma", "Jace",
	"Kiro", "Loma", "Mira", "Nery", "Oliv",
	"Pixa", "Quin", "Ryen", "Syla", "Tiva",
	"Ulmo", "Viva", "Wren", "Xina", "Yira",
	"Zeta", "Arlo", "Bela", "Celo", "Dory",
	"Erlo", "Fina", "Grin", "Hera", "Isla",
	"Jilo", "Kren", "Lira", "Mory", "Nira",
	"Olen", "Pera", "Qara", "Ryna", "Siva",
	"Tery", "Ulen", "Vira", "Wila", "Xira",
}

var fullNames []string = []string{
	"王小明", "李晓华", "张三丰", "刘丽丽", "陈志强",
	"杨国华", "赵雪儿", "黄嘉欣", "周建华", "吴婷婷",
	"徐文杰", "孙思怡", "马文浩", "朱玉婷", "胡志军",
	"林秋雯", "郑少华", "谢文婷", "罗文涛", "韩晓峰",
	"何志刚", "高小玲", "郭秋萍", "梁志伟", "宋晓丽",
	"邓伟明", "龚秀英", "方志勇", "石春梅", "任文辉",
	"田子涵", "魏文博", "范丽丽", "彭晓光", "曾志杰",
	"余小慧", "谭宇航", "吕子萱", "贺志强", "姜小龙",
	"钟志明", "容晓娟", "陶子健", "滕小红", "白志鹏",
	"秦晓萍", "侯志新", "毛玉珍", "常秀芳", "包晓玲",
}

var roles []string = []string{
	"普通助理", "资深助理", "黑心",
}

func GenerateRandomUser() *domain.User {
	username := fmt.Sprintf("%s%d", usernames[rand.Intn(len(usernames))], rand.Intn(1000))
	fullName := fullNames[rand.Intn(len(fullNames))]
	role := roles[rand.Intn(len(roles))]

	return &domain.User{
		Username:     username,
		FullName:     fullName,
		Role:         role,
		PasswordHash: "$2a$10$66EGjNqoQ6JvY4LOsp8P6OIpsFUntArPlcAvo5bd9IyeHfu9XiHrq",
	}
}
